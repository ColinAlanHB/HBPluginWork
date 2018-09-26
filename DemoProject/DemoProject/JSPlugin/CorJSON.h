
 
#import <Foundation/Foundation.h>

@interface NSString (CorJSON)

/**
 *  尝试将一个JSON字符串反序列化为对象
 *
 *  @return 反序列化后的对象,解析失败时返回nil
 */
- (nullable id)ac_JSONValue;

@end


@interface NSObject (CorJSON)

/**
 *  尝试将一个对象(NSString,NSDictionary,NSArray)序列化为JSON字符串
 *  @return 序列化后的JSON字符串,序列化失败时返回nil;
 */
- (nullable NSString *)ac_JSONFragment;
@end
