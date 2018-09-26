//
//  PluginManager.m
//  DemoProject
//
//  Created by hb on 2018/9/25.
//  Copyright © 2018年 hb. All rights reserved.
//

#import "PluginManager.h"


@implementation PluginManager

+ (void)loadDynamicPlugins:(NSString *)pluginName {
    static NSMutableArray *loadedPlugins;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        loadedPlugins = [NSMutableArray array];
    });
    if ([loadedPlugins containsObject:pluginName]) {
        return;
    }
    [loadedPlugins addObject:pluginName];
    
    NSString *frameworkName = [NSString stringWithFormat:@"%@.framework",pluginName];
    
    //载入指定document子目录下的framework
    NSBundle *dynamicBundle = [NSBundle bundleWithPath:[[PluginManager dynamicPluginFrameworkFolderPath] stringByAppendingPathComponent:frameworkName]];
    
    if(dynamicBundle && [dynamicBundle load]){
        return;
    }
    
    //载入dyFiles目录下的framework
    //本地打包用
    
    dynamicBundle = [NSBundle bundleWithPath:[NSString pathWithComponents:@[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES).firstObject,@"dyFiles",frameworkName]]];
    if(dynamicBundle && [dynamicBundle load]){
        return;
    }
    
}

+ (NSString *)dynamicPluginFrameworkFolderPath{
    NSString *documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    static NSString *dynamicFrameworkFolder =@"dynamicPlugins";
    NSString  *dynamicPluginFrameworkFolderPath=[documentsPath stringByAppendingPathComponent:dynamicFrameworkFolder];
    
    NSFileManager *fm=[NSFileManager defaultManager];
    NSError *error=nil;
    BOOL isFolder=NO;
    if(![fm fileExistsAtPath:dynamicPluginFrameworkFolderPath isDirectory:&isFolder] || !isFolder){// 如果目录不存在，或者目录不是文件夹，就创建一个
        
        [fm createDirectoryAtPath:dynamicPluginFrameworkFolderPath withIntermediateDirectories:NO attributes:nil error:&error];
        if(error){
        
        }
    }
    
    return dynamicPluginFrameworkFolderPath;
}

+ (NSMutableArray *)arrayFromArguments:(JSValue *)arguments count:(NSInteger)argCount{
    NSMutableArray *array = [NSMutableArray array];
    for (int i = 0; i < argCount; i++) {
        JSValue *value = arguments[i];
        if (value.ac_type != CorJSValueTypeFunction) {
            id obj = [value toObject];
            if (!obj || [obj isKindOfClass:[NSNull class]]) {
                obj = [NSNull null];
            }
            [array addObject:obj];
            continue;
        }
        id ref = [CorJSFunctionRef functionRefFromJSValue: value];
        if (!ref) {
            ref = [NSNull null];
        }
        [array addObject:ref];
    }
    return array;
}


@end
