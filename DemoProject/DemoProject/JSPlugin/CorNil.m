

#import "CorNil.h"
@implementation CorNil

static id nilSingleton = nil;


+ (void)initialize{
    if (self.class == [CorNil class]) {
        if (!nilSingleton) {
            nilSingleton = [[self alloc] init];
        }
    }
}


+ (instancetype)null{
    return nilSingleton;
}

- (instancetype)init{
    return self;
}

#pragma mark NSCopying

- (id)copyWithZone:(NSZone *)zone {
    return self;
}

#pragma mark Forwarding machinery

- (void)forwardInvocation:(NSInvocation *)anInvocation {
    NSUInteger returnLength = [[anInvocation methodSignature] methodReturnLength];
    if (!returnLength) {
        return;
    }
    
    char buffer[returnLength];
    memset(buffer, 0, returnLength);
    
    [anInvocation setReturnValue:buffer];
}

//- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector {
//    return ac_globalMethodSignatureForSelector(selector);
//}

- (BOOL)respondsToSelector:(SEL)selector {
    return NO;

}

#pragma mark NSObject protocol

- (BOOL)conformsToProtocol:(Protocol *)aProtocol {
    return NO;
}

- (NSUInteger)hash {
    return 0;
}

- (BOOL)isEqual:(id)obj {
    return !obj || obj == self || [obj isEqual:[NSNull null]];
}

- (BOOL)isKindOfClass:(Class)class {
    return [class isEqual:[CorNil class]] || [class isEqual:[NSNull class]];
}

- (BOOL)isMemberOfClass:(Class)class {
    return [class isEqual:[CorNil class]] || [class isEqual:[NSNull class]];
}

- (BOOL)isProxy {
    return NO;
}

@end

