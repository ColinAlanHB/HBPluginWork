

#import "CorJSON.h"
@implementation  NSString (CorJSON)

- (id)ac_JSONValue{
    NSError *error = nil;
    id obj = [NSJSONSerialization JSONObjectWithData:[self dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingAllowFragments error:&error];
    if (error) {
        //CorLogWarning(@"JSON parse error:%@",error.localizedDescription);
    }
    return obj;
}

@end

@implementation NSObject (CorJSON)

- (NSString *)ac_JSONFragment{
    if ([NSJSONSerialization isValidJSONObject:self]) {
        NSError *error = nil;
        NSData *stringData = [NSJSONSerialization dataWithJSONObject:self options:0 error:&error];
        if (error) {
            //CorLogWarning(@"JSON stringify error:%@",error.localizedDescription);
        }
        return [[NSString alloc]initWithData:stringData encoding:NSUTF8StringEncoding];
    }
    if ([self isKindOfClass:[NSString class]]) {

        NSString *arrStr = [@[self] ac_JSONFragment];
        NSString *result = [arrStr substringWithRange:NSMakeRange(1, arrStr.length -2)];
        return result;
        

    }
    return nil;
}

@end
