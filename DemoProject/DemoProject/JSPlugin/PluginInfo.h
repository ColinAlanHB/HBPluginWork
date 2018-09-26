//
//  PluginInfo.h
//  DemoProject
//
//  Created by hb on 2018/9/25.
//  Copyright © 2018年 hb. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PluginInfo : NSObject
@property (nonatomic,strong)NSString *name;
/**
 *  methods = {方法名:@(executeOption)}
 */
@property (nonatomic,strong)NSMutableArray <NSString *> *methods;

- (instancetype)initWithName:(NSString *)name;

@end
