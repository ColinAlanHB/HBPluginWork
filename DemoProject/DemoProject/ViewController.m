//
//  ViewController.m
//  DemoProject
//
//  Created by hb on 2018/9/25.
//  Copyright © 2018年 hb. All rights reserved.
//

#import "ViewController.h"
#import <objc/runtime.h>
#import <objc/message.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "PluginInfo.h"
#import "PluginManager.h"
#import "CorJSValueSupport.h"
#import "CorInvoker.h"
#import "CorArguments.h"


@protocol JSCHandler <JSExport>

JSExportAs(execute,-(id)executeWithPlugin:(NSString *)pluginName method:(NSString *)methodName arguments:(JSValue *)arguments argCount:(NSInteger)argCount);

@end

NSString *const HandlerInjectField = @"_JSCHandler_";
static NSString *CorEngineJavaScriptCoreBaseJS;

@interface ViewController ()<UIWebViewDelegate,UIScrollViewDelegate,JSCHandler>

@property (nonatomic, strong) UIWebView *webView;

@property (nonatomic,weak,readwrite)JSContext *JSContext;

@property (nonatomic,weak)JSContext *ctx;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.view addSubview:self.webView];
    
    NSString *path = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"widget/index.html"];
    
    NSURL *url = [NSURL fileURLWithPath:path];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [self.webView loadRequest:request];
}

- (UIWebView *)webView {
    if (!_webView) {
        _webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height)];
        _webView.scrollView.bounces = NO;
        _webView.backgroundColor = [UIColor clearColor];
        _webView.scrollView.backgroundColor = [UIColor clearColor];
        _webView.scalesPageToFit = YES;
        _webView.scrollView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        _webView.scrollView.delegate = self;
        _webView.delegate = self;
        _webView.dataDetectorTypes = UIDataDetectorTypeNone;
        // 修改webview打开前界面白屏问题
        UIView* webBrowseView = self.webView.scrollView.subviews[0];
        webBrowseView.backgroundColor = [UIColor clearColor];
        // 此行至关重要，不可删除
        webBrowseView.frame = CGRectZero;
    }
    return _webView;
}

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

- (void)initializeWithJSContext:(JSContext *)context{
    context[HandlerInjectField] = self;
    NSString *baseJS = [self generateBaseJS];
    [context evaluateScript:baseJS];
    [context setExceptionHandler:^(JSContext *ctx, JSValue *exception) {
        ctx.exception = exception;
    }];
    self.ctx = context;
}

- (NSString *)generateBaseJS{
    __block NSMutableDictionary<NSString *,PluginInfo *> *plugins = [NSMutableDictionary dictionary];
    
    NSArray <PluginInfo *> *enginePlugins = @[[self pluginDemo1],[self pluginDemo2]];
    [enginePlugins enumerateObjectsUsingBlock:^(PluginInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [plugins setValue:obj forKey:obj.name];
    }];
    __block NSMutableString *js = [NSMutableString stringWithFormat:@""];
    [plugins enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull key, PluginInfo * _Nonnull obj, BOOL * _Nonnull stop) {
        [js appendString:[self javaScriptForPlugin:obj]];
    }];
    return js;
}

- (NSString *)javaScriptForPlugin:(PluginInfo *)plugin{
    if(!plugin){
        return @"";
    }
    NSMutableString *js =[NSMutableString stringWithFormat:@""];
    [js appendFormat:@"%@={};",plugin.name];
    [plugin.methods enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
         [js appendString:[self javaScriptForMethod:obj plugin:plugin.name]];
    }];
    return js;
}

- (NSString *)javaScriptForMethod:(NSString *)method plugin:(NSString *)plugin {
    return [NSString stringWithFormat:@"%@.%@=function(){var argCount = arguments.length;var args = [];for(var i = 0; i < argCount; i++){args[i] = arguments[i];};return _JSCHandler_.execute('%@','%@',args,argCount);};",plugin,method,plugin,method];
}


- (NSDictionary *)exceptions{
    return @{
             };
}

- (PluginInfo *)pluginDemo1{
    PluginInfo *pluginDemo1 = [[PluginInfo alloc] initWithName:@"PluginDemo1"];
    pluginDemo1.methods = [@[@"demo1alert"] mutableCopy];
    return pluginDemo1;
}

- (PluginInfo *)pluginDemo2{
    PluginInfo *pluginDemo2 = [[PluginInfo alloc] initWithName:@"PluginDemo2"];
    pluginDemo2.methods = [@[@"demo2alert"] mutableCopy];
    return pluginDemo2;
}


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

- (BOOL)selector:(SEL)sel isAsynchronousMethodInClass:(Class)cls{
    NSParameterAssert(sel != nil);
    NSParameterAssert(cls != nil);
    
    static NSMutableDictionary<NSString *,NSNumber *> *selCache;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        selCache = [NSMutableDictionary dictionary];
    });
    NSString *identifier = [NSStringFromClass(cls) stringByAppendingString:NSStringFromSelector(sel)];
    if ([selCache objectForKey:identifier]) {
        return selCache[identifier].boolValue;
    }
    
    Method method = class_getInstanceMethod(cls, sel);
    NSParameterAssert(method != NULL);
    
    NSString *type = [NSString stringWithCString:method_getTypeEncoding(method) encoding:NSUTF8StringEncoding];
    BOOL isAsync = YES;
    if ([type hasPrefix:@"@"]) {
        isAsync = NO;
    }
    [selCache setValue:@(isAsync) forKey:identifier];
    return isAsync;
}





@end
