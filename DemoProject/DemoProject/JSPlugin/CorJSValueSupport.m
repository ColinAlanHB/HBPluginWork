

#import "CorJSValueSupport.h"

@implementation JSValue (CorKit)


- (CorJSValueType)ac_type{
    if ([self isNull]) {
        return CorJSValueTypeNull;
    }
    if ([self isUndefined]) {
        return CorJSValueTypeUndefined;
    }
    if ([self isString]) {
        return CorJSValueTypeString;
    }
    if ([self isBoolean]) {
        return CorJSValueTypeBoolean;
    }
    if ([self isNumber]) {
        return CorJSValueTypeNumber;
    }
    if ([self respondsToSelector:@selector(isArray)] && [self isArray]) {
        return CorJSValueTypeArray;
    }
    if ([self respondsToSelector:@selector(isDate)] && [self isDate]) {
        return CorJSValueTypeDate;
    }
    JSValueRef valueRef = self.JSValueRef;
    JSContextRef ctxRef = self.context.JSGlobalContextRef;
    if (JSValueIsObject(ctxRef, valueRef)) {
        JSObjectRef objRef = (JSObjectRef)valueRef;
        if (JSObjectIsFunction(ctxRef, objRef)) {
            return CorJSValueTypeFunction;
        }else{
            return CorJSValueTypeObject;
        }
    }
    return CorJSValueTypeUnknown;
}


- (void)ac_callWithArguments:(NSArray *)arguments{
    [self ac_callWithArguments:arguments waitingUntilNextRunLoop:YES inQueue:nil completionHandler:nil];
}

- (void)ac_callWithArguments:(NSArray *)arguments
           completionHandler:(void (^)(JSValue *))completionHandler{
    [self ac_callWithArguments:arguments waitingUntilNextRunLoop:YES inQueue:nil completionHandler:completionHandler];
}

- (void)ac_callWithArguments:(NSArray *)arguments
     waitingUntilNextRunLoop:(BOOL)waitingUntilNextRunLoop
                     inQueue:(dispatch_queue_t)queue
           completionHandler:(void (^)(JSValue *))completionHandler{
    CorJSValueType type = self.ac_type;
    if (type != CorJSValueTypeFunction) {
        if (completionHandler) {
            completionHandler(nil);
        }
        return;
    }
    
    if (!queue) {
        queue = dispatch_get_main_queue();
    }
    dispatch_async(queue, ^{
        void (^exec)(void) = ^{
            JSValue *returnValue = [self callWithArguments:arguments];
            if (completionHandler) {
                completionHandler(returnValue);
            }
        };
        if (!waitingUntilNextRunLoop) {
            exec();
            return;
        }
        JSValue *setTimeout = self.context[@"setTimeout"];
        CorJSValueType type = setTimeout.ac_type;
        
        if (type == CorJSValueTypeFunction) {
            [setTimeout callWithArguments:@[exec,@0]];
        }else{
            //当前JSContext没有setTimeout方法。可能是自定义的JSContext,而非来自webView
            exec();
        }
        
    });
}

@end

@implementation JSContext(CorKit)

- (JSValue *)ac_JSValueForKeyPath:(NSString *)keyPath{
    JSValue *value = nil;
    NSArray<NSString *> *components = [keyPath componentsSeparatedByString:@"."];
    for (int i = 0; i < components.count; i++) {
        if (!value) {
            value = [self objectForKeyedSubscript:components[i]];
        }else{
            value = [value objectForKeyedSubscript:components[i]];
        }
    }
    return value;
}

@end


