#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <QuickLook/QuickLook.h>

@interface RCT_EXTERN_MODULE(ModelPreviewModule, NSObject)

RCT_EXPORT_METHOD(showModelPreview:(NSString *)filePath)
RCT_EXPORT_METHOD(getLastGeneratedPath:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
