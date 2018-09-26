//
//  PluginDemo1.m
//  DemoProject
//
//  Created by hb on 2018/9/25.
//  Copyright © 2018年 hb. All rights reserved.
//

#import "PluginDemo1.h"
#import "CorJSFunctionRef.h"
#import "CorArguments.h"

@interface PluginDemo1()

@property (nonatomic,strong) CorJSFunctionRef *cb;

@end

@implementation PluginDemo1

- (void)demo1alert:(NSMutableArray *)inArguments {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"PluginDemo1" message:inArguments.firstObject delegate:self cancelButtonTitle:@"取消" otherButtonTitles:nil, nil];
    _cb = inArguments.lastObject;
    [alert show];
    
    [_cb executeWithArguments:CorArgsPack(@"456")];
    
}


@end
