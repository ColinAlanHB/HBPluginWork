//
//  PluginManager.h
//  DemoProject
//
//  Created by hb on 2018/9/25.
//  Copyright © 2018年 hb. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CorJSFunctionRefInternal.h"
#import "CorJSFunctionRef.h"
#import "CorJSValueSupport.h"

@interface PluginManager : NSObject

+ (void)loadDynamicPlugins:(NSString *)pluginName;

+ (NSMutableArray *)arrayFromArguments:(JSValue *)arguments count:(NSInteger)argCount;

@end
