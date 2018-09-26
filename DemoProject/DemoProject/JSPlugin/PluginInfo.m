//
//  PluginInfo.m
//  DemoProject
//
//  Created by hb on 2018/9/25.
//  Copyright © 2018年 hb. All rights reserved.
//

#import "PluginInfo.h"

@implementation PluginInfo

- (instancetype)initWithName:(NSString *)name {
    self = [super init];
    if (self) {
        _name=name;
        _methods = [NSMutableArray array];
    }
    return self;
}

@end
