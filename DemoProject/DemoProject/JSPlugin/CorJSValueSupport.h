
#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
typedef NS_ENUM(NSInteger,CorJSValueType){
    CorJSValueTypeUnknown = -1,
    CorJSValueTypeUndefined = 0,
    CorJSValueTypeNull,
    CorJSValueTypeNumber,
    CorJSValueTypeFunction,
    CorJSValueTypeObject,
    CorJSValueTypeBoolean,
    CorJSValueTypeString,
    CorJSValueTypeArray,//仅iOS 9+. 在低版本系统上,JS Array会返回CorJSValueTypeObject
    CorJSValueTypeDate,//仅iOS 9+. 在低版本系统上,JS Date会返回CorJSValueTypeObject
    
};

@interface JSValue (CorKit)

/**
 *  返回当前JSValue的类型
 */
- (CorJSValueType)ac_type;


/**
 *  调用一个JS函数
 *
 *  @param arguments 参数
 *  @param waitingUntilNextRunLoop  NO-立即执行 YES-加入队列中,等待下一次JS的RunLoop再执行
 *  @discussion                     当此JS函数含有alert或者更新UI操作时,立刻执行可能会导致主线程死锁。因此除非此方法对延迟非常敏感,否则此参数应该传YES
 *  @param queue                    执行JS的线程,不传时默认为主线程。
 *  @discussion                     对基于UIWebView实现的Cor网页,必须在主线程中调用JS函数
 *  @param completionHandler        执行完毕时会在queue线程执行此block.此block有参数为调用此JS函数的返回值,当且仅当函数调用失败时，此block参数returnValue为nil。
 *  @discussion                     对于无返回值的JS函数,returnValue为一个代表<undefined>的JSValue,而不是nil
 */
- (void)ac_callWithArguments:(NSArray *)arguments
     waitingUntilNextRunLoop:(BOOL)waitingUntilNextRunLoop
                     inQueue:(dispatch_queue_t)queue
           completionHandler:(void (^)(JSValue * returnValue))completionHandler;

/**
 *  上个方法的便捷实现
 *  在主线程执行JS,在主线程执行completionHandler回调
 */
- (void)ac_callWithArguments:(NSArray *)arguments
           completionHandler:(void (^)(JSValue * returnValue))completionHandler;
/**
 *  不需要返回值时,可以直接使用此方法
 */
- (void)ac_callWithArguments:(NSArray *)arguments;
@end

@interface JSContext(CorKit)

/**
 *  根据keyPath获得对应的JSValue
 *  @example [ctx ac_JSValueForKeyPath:@"a.b.c"] 相当于 ctx[@"a"][@"b"][@"c"]
 *
 *  @return keyPath对应的JSValue
 */
- (JSValue *)ac_JSValueForKeyPath:(NSString *)keyPath;
@end


