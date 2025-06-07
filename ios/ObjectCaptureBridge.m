//
//  ObjectCaptureBridge.m
//  trevianappsprint
//
//  Created by Lola Nuñez Gouget on 6/6/25.
//
// ObjectCaptureBridge.mm

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ObjectCaptureModule, NSObject)
RCT_EXTERN_METHOD(startObjectCapture: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
@end
