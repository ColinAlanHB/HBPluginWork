
#import <Foundation/Foundation.h>

/**
 *  NSNull的替代品
 *  不会导致unrecogized selector崩溃
 */
@interface CorNil : NSProxy


+ (instancetype)null;

@end
