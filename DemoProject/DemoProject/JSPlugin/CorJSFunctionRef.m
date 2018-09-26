

#import "CorJSFunctionRef.h"
#import "CorJSValueSupport.h"
#import "CorJSFunctionRefInternal.h"



@implementation CorJSFunctionRef

+ (instancetype)functionRefFromJSValue:(JSValue *)value{
    if (!value || value.ac_type != CorJSValueTypeFunction) {
        return nil;
    }
    
    
    CorJSFunctionRef *funcRef = [[self alloc]init];
    if (funcRef) {
        JSContext *ctx = value.context;
        

        funcRef.ctx = ctx;
        funcRef.identifier = [NSUUID UUID].UUIDString;
        funcRef.managedFunction = [[JSManagedValue alloc]initWithValue:value];
        funcRef.machine = value.context.virtualMachine;
        [funcRef.machine addManagedReference:funcRef.managedFunction withOwner:self];
        
        JSValue *intenal = ctx[@"_CorJSFunctionRefIntenal"];
        if ([intenal isUndefined]) {
            intenal = [JSValue valueWithObject:@{} inContext:ctx];
            ctx[@"_CorJSFunctionRefIntenal"] = intenal;
        }
        
        intenal[funcRef.identifier] = value;
    }
    return funcRef;

}





- (void)executeWithArguments:(NSArray *)args completionHandler:(void (^)(JSValue *returnValue))completionHandler{
    JSValue *value = self.managedFunction.value;
    if (!value) {
        value = self.ctx[@"_CorJSFunctionRefIntenal"][self.identifier];
    }
    if (value) {
        [value ac_callWithArguments:args completionHandler:completionHandler];
    }else{
        if (completionHandler) {
            completionHandler(nil);
        }
    }
}

- (void)executeWithArguments:(NSArray *)args{
    [self executeWithArguments:args completionHandler:nil];
}

- (void)dealloc{
    self.ctx[@"_CorJSFunctionRefIntenal"][self.identifier] = nil;
    [self.machine removeManagedReference:self.managedFunction withOwner:self];
}



@end
