# 简介
iOS 插件篇主要内容分为三部分:原生与h5交互的实现,插件获取app生命周期能力,插件的封装三部分,插件获取app生命周期能力这个会单独介绍,现在很多功能如支付宝,第三方分享都需要插件能获取生命周期的能力,任何一部分都能在开发过程中单独使用.
## 原生与h5交互的实现原理
最原始链接拦截和`wkwebview`的`addScriptMessageHandler`就不介绍了,这里使用的是利用`<JavaScriptCore/JavaScriptCore.h>`库中的`JSContext`和`runtime`实现的,网上已经有了`JSContext`交互实现的方法介绍,但是都没有结合`runtime`来实现插件的即插即用的功能,利用`runtime`可以让插件单独编译成framework,在打包之前勾选特定的插件就能实现即插即用的功能

## demo地址
[demo地址](https://github.com/ColinAlanHB/HBPluginWork/tree/master/DemoProject)
[简书地址](https://www.jianshu.com/p/fbbe787536a8)


## 获取JSContext

* 在`- (void)webViewDidFinishLoad:(UIWebView *)webView` 中获取JSContext 对象,如下所示:
```
- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [self initializeJSCHandler];
}

- (void)initializeJSCHandler{
    if(_JSContext){
        _JSContext = nil;
    }
    JSContext *context = self.JSContext;
    if(!context){
        return;
    }
    [self initializeWithJSContext:context];
}

```

* 使用懒加载或者JSContext对象并保存,如下所示:

```
- (JSContext *)JSContext{
    if (!_JSContext) {
        JSContext *context = nil;
        @try {
            context = [self.webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
        }@catch (...) {}
        _JSContext = context;
        // 捕捉网页加载失败的异常信息
        [self.webView stringByEvaluatingJavaScriptFromString:@"window.onerror = function(error, url, line) {console.error('ERROR: '+error+' URL:'+url+' L:'+line);};"];
        //打印异常
        _JSContext.exceptionHandler = ^(JSContext *context, JSValue *exceptionValue){
            context.exception = exceptionValue;
            NSLog(@"%@", exceptionValue);
        };
    }
    return _JSContext;
}
```

* 在`JSContext`中注入统一的交互对象`_JSCHandler_`,如下所示:
```
NSString *const HandlerInjectField = @"_JSCHandler_";

- (void)initializeWithJSContext:(JSContext *)context{
    context[HandlerInjectField] = self;
    NSString *baseJS = [self generateBaseJS];
    [context evaluateScript:baseJS];
    [context setExceptionHandler:^(JSContext *ctx, JSValue *exception) {
        ctx.exception = exception;
    }];
    self.ctx = context;
}
```
* 上面实现的方法中,也同步将插件的对象和方法注入到context中`NSString *baseJS = [self generateBaseJS];` `generateBaseJS`方法中可以将我们制作好的插件类名称和方法名通过拼接成特定的字符串注入到context中.如下所示:
```
- (NSString *)javaScriptForMethod:(NSString *)method plugin:(NSString *)plugin {
    return [NSString stringWithFormat:@"%@.%@=function(){var argCount = arguments.length;var args = [];for(var i = 0; i < argCount; i++){args[i] = arguments[i];};return _JSCHandler_.execute('%@','%@',args,argCount);};",plugin,method,plugin,method];
}
```
* 可以看下运行时字符串的效果:

```
PluginDemo1={};PluginDemo1.demo1alert=function(){var argCount = arguments.length;var args = [];for(var i = 0; i < argCount; i++){args[i] = arguments[i];};return _JSCHandler_.execute('PluginDemo1','demo1alert',args,argCount);};
```

可以看到在js中首选声明了PluginDemo1这个对象,还有它的demo1alert这个方法,最后`rutern`的实现方式却是通过交互对象`_JSCHandler_`的`execute`方法实现的,在这里我们通过`JSExport` 协议将`execute`转化为原生实现的一个方法

```
@protocol JSCHandler <JSExport>

JSExportAs(execute,-(id)executeWithPlugin:(NSString *)pluginName method:(NSString *)methodName arguments:(JSValue *)arguments argCount:(NSInteger)argCount);

@end

```
* 在实现的方法的地方,我们通过`NSClassFromString`找到PluginDemo1的对象,并且通过`CorInvoker`这个类利用`runtime`来实现方法,并且带上参数

```
- (id)executeWithPlugin:(NSString *)pluginName method:(NSString *)methodName arguments:(JSValue *)arguments argCount:(NSInteger)argCount {
    
    [PluginManager loadDynamicPlugins:pluginName];
    
    Class pluginClass = NSClassFromString(pluginName);
    id pluginInstance = [[pluginClass alloc] init];
    if (!pluginInstance) {
        return nil;
    }

    NSString *selector = [methodName stringByAppendingString:@":"];
    SEL sel = NSSelectorFromString(selector);
    if(![pluginInstance respondsToSelector:sel]){
        return nil;
    }
    
    id args = nil;
    args = [PluginManager arrayFromArguments:arguments count:argCount];
    
    BOOL isAsync = [self selector:sel isAsynchronousMethodInClass:[pluginInstance class]];
    
    
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
    if (isAsync) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [pluginInstance ac_invoke:selector arguments:CorArgsPack(args)];
        });
        return nil;
    }else{
        return [pluginInstance ac_invoke:selector arguments:CorArgsPack(args)];
    }
#pragma clang diagnostic pop
    
    return nil;
}

```

* runtime实现的方式这就不多说了,具体可以看demo

*  可以看下PluginDemo1这个类的实现:
```
@implementation PluginDemo1

- (void)demo1alert:(NSMutableArray *)inArguments {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"PluginDemo1" message:inArguments.firstObject delegate:self cancelButtonTitle:@"取消" otherButtonTitles:nil, nil];
    _cb = inArguments.lastObject;
    [alert show];
    
    [_cb executeWithArguments:CorArgsPack(@"456")]; 
}
```

* 这里可以看到`CorJSFunctionRef *cb` 这个对象是专门针对js回调所创建的,js使用回调的方式如下:

```
PluginDemo1.demo1alert('123',function(answer){
                        alert(answer);
                     });
```

其中的第二个参数是一个回调`function(answer){alert(answer);}`,这里使用`CorJSFunctionRef *cb`来接收这个回调,并且可以在想要的地方通过`executeWithArguments`实现这个回调

# 总结
交互的原理这里就讲完了,因为使用的是`runtime`的方式找到类并实现方法,所以可以将PluginDemo这个类封装成库,这样就可以在任何的项目中使用这个库了








