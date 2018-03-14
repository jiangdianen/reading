/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <NavigationHybrid/NavigationHybrid.h>
#import <Bugly/Bugly.h>
#import "SplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
  [Bugly startWithAppId:@"b0c9343009"];
#endif
  
  [[HBDReactBridgeManager sharedInstance] installWithBundleURL:jsCodeLocation launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = UIColor.whiteColor;
  self.window.rootViewController = [[UIViewController alloc] init];
  [self.window makeKeyAndVisible];
  [SplashScreen show];
  return YES;
}

@end
