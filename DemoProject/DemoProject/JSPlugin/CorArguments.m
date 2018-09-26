

#import "CorArguments.h"
#import "CorJSON.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import "CorJSFunctionRefInternal.h"


NSString* _Nullable ac_stringArg(id _Nullable arg){
    if ([arg isKindOfClass:[JSValue class]]) {
        arg = [arg toObject];
    }
    if ([arg isKindOfClass:[NSString class]]) {
        return arg;
    }
    if ([arg isKindOfClass:[NSNumber class]]) {
        return [arg stringValue];
    }
    return nil;
}




NSNumber* _Nullable ac_numberArg(id _Nullable arg){
    if ([arg isKindOfClass:[JSValue class]]) {
        arg = [arg toObject];
    }
    if ([arg isKindOfClass:[NSString class]]  && [arg length] > 0) {
        return [NSDecimalNumber decimalNumberWithString:arg];
    }
    if ([arg isKindOfClass:[NSNumber class]]) {
        return arg;
    }
    return nil;
}

NSDictionary* _Nullable ac_dictionaryArg(id _Nullable arg){
    if ([arg isKindOfClass:[JSValue class]]) {
        arg = [arg toObject];
    }
    if ([arg isKindOfClass:[NSString class]]) {
        arg = [arg ac_JSONValue];
    }
    if ([arg isKindOfClass:[NSDictionary class]]) {
        return arg;
    }
    return nil;
}

NSArray* _Nullable ac_arrayArg(id _Nullable arg){
    if ([arg isKindOfClass:[JSValue class]]) {
        arg = [arg toObject];
    }
    NSString *arrayStr = nil;
    if ([arg isKindOfClass:[NSString class]]) {
        arg = [arg ac_JSONValue];
        //兼容JS SDK的URL转码得到的string
        arrayStr = [arg isKindOfClass:[NSString class]]? arg : nil;
    }
    if ([arg isKindOfClass:[NSArray class]]) {
        return arg;
    }
    
    arrayStr = [arrayStr stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    if([arrayStr hasPrefix:@"["] && [arrayStr hasSuffix:@"]"]){
        arrayStr = [arrayStr stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"[]"]];
        return [arrayStr componentsSeparatedByString:@","];
    }
    
    return nil;
}

CorJSFunctionRef * _Nullable ac_JSFunctionArg(id _Nullable arg){
    if ([arg isKindOfClass:[CorJSFunctionRef class]]) {
        return arg;
    }
    if ([arg isKindOfClass:[JSValue class]]) {
        return [CorJSFunctionRef functionRefFromJSValue:arg];
    }
    return nil;
}

typedef NS_ENUM(NSInteger,CorArgumentsHelperParseOption){
    CorArgumentsHelperParseDefault,
    CorArgumentsHelperParseAsNSString,
    CorArgumentsHelperParseAsNSNumber,
    CorArgumentsHelperParseAsNSDictionary,
    CorArgumentsHelperParseAsNSArray,
    CorArgumentsHelperParseAsJSFunction
};


#define _ACHasClassNamePrefix(cls) hasPrefix:NSStringFromClass([cls class])

@implementation CorArgumentsHelper

+ (CorArgumentsHelperParseOption)parseOptionFromDefination:(NSString *)definationStr{
    static NSArray * modifiers = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        modifiers = @[@"__weak",@"__block",@"__strong",@"__autoreleasing",@"__unsafe_unretained",@"__unused",@"__nullable",@"__nonnull"];
    });
    while (1) {
        BOOL changed = NO;
        NSString *tmp = [definationStr stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
        if (![tmp isEqual:definationStr]) {
            changed = YES;
            definationStr = tmp;
        }
        for (NSString *mod in modifiers) {
            if ([definationStr hasPrefix:mod]) {
                definationStr = [definationStr substringFromIndex:[mod length]];
                changed = YES;
            }
        }
        if (!changed) {
            break;
        }
    }
    if ([definationStr _ACHasClassNamePrefix(NSString)]) {
        return CorArgumentsHelperParseAsNSString;
    }
    if ([definationStr _ACHasClassNamePrefix(NSNumber)]) {
        return CorArgumentsHelperParseAsNSNumber;
    }
    if ([definationStr _ACHasClassNamePrefix(NSArray)]) {
        return CorArgumentsHelperParseAsNSArray;
    }
    if ([definationStr _ACHasClassNamePrefix(NSDictionary)]) {
        return CorArgumentsHelperParseAsNSDictionary;
    }
    if ([definationStr _ACHasClassNamePrefix(CorJSFunctionRef)]) {
        return CorArgumentsHelperParseAsJSFunction;
    }
    return CorArgumentsHelperParseDefault;
}

+ (instancetype)helper{
    static CorArgumentsHelper *helper = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        helper = [[self alloc] init];
    });
    return helper;
}

+ (nullable id)unpackedObjectFromObject:(nullable id)obj definitionString:(NSString *)defStr{
    if ([obj isKindOfClass:[CorNil class]]) {
        return nil;
    }
    CorArgumentsHelperParseOption option = [self parseOptionFromDefination:defStr];
    switch (option) {
        case CorArgumentsHelperParseDefault: {
            return obj;
            break;
        }
        case CorArgumentsHelperParseAsNSString: {
            return ac_stringArg(obj);
            break;
        }
        case CorArgumentsHelperParseAsNSNumber: {
            return ac_numberArg(obj);
            break;
        }
        case CorArgumentsHelperParseAsNSDictionary: {
            return ac_dictionaryArg(obj);
            break;
        }
        case CorArgumentsHelperParseAsNSArray: {
            return ac_arrayArg(obj);
            break;
        }
        case CorArgumentsHelperParseAsJSFunction: {
            return ac_JSFunctionArg(obj);
            break;
        }
    }
}

- (void)setObject:(NSArray *)args forKeyedSubscript:(NSArray<NSValue *> *)variables{
    NSCParameterAssert(variables != nil);
    [variables enumerateObjectsUsingBlock:^(NSValue *value, NSUInteger index, BOOL *stop) {
        __strong id *ptr = (__strong id *)value.pointerValue;
        if (args.count > index) {
            *ptr = args[index];
        }
    }];
}

@end
