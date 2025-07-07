#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ModelPreviewModule, NSObject)

RCT_EXTERN_METHOD(showModelPreview:(NSString *)filePath)
RCT_EXTERN_METHOD(getLastGeneratedPath:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLastGeneratedPath:(NSString *)filePath)

@end
