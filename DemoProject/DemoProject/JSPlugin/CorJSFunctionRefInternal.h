


@class JSManagedValue;
@class JSVirtualMachine;

#import "CorJSFunctionRef.h"
#import <JavaScriptCore/JavaScriptCore.h>

NS_ASSUME_NONNULL_BEGIN
@interface CorJSFunctionRef()

@property (nonatomic,strong)JSManagedValue *managedFunction;
@property (nonatomic,strong)NSString *identifier;
@property (nonatomic,weak)JSVirtualMachine *machine;
@property (nonatomic,weak)JSContext *ctx;

/**
 *  根据JSValue获得一个CorJSFunctionRef
 *  @brief 在此对象被释放前,只要JS上下文没有被销毁,此对象会保证其对应的JS函数不被GC机制回收
 *
 *  @param value 必须是一个JS的function。不是function时此方法会返回nil
 */
+ (nullable instancetype)functionRefFromJSValue:(JSValue *)value;

@end

NS_ASSUME_NONNULL_END
