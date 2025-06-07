//
//  ObjectCaptureModule.swift
//  trevianappsprint
//
//  Created by Lola Nuñez Gouget on 6/6/25.
//

import Foundation
import SwiftUI

@objc(ObjectCaptureModule)
class ObjectCaptureModule: NSObject {

  @objc
  func startObjectCapture(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let window = scene.windows.first,
            let rootVC = window.rootViewController else {
        reject("NO_ROOT", "No se encontró rootViewController", nil)
        return
      }

      let swiftVC = UIHostingController(rootView: ContentView())
      rootVC.present(swiftVC, animated: true)

      // Resolución ficticia por ahora
      resolve("file:///path/to/model.usdz")
    }
  }
}
