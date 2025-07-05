import Foundation
import SwiftUI

@objc(ObjectCaptureModule)
class ObjectCaptureModule: NSObject {

  @objc
  func startObjectCapture(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
  DispatchQueue.main.async {
    guard
      let scene = UIApplication.shared.connectedScenes
        .compactMap({ $0 as? UIWindowScene }).first,
      let window = scene.windows.first(where: { $0.isKeyWindow }),
      let rootVC = window.rootViewController
    else {
      reject("NO_ROOT", "No se encontró una ventana activa para presentar el VC", nil)
      return
    }

    // ✅ Modificamos ContentView para aceptar un callback
    let scanView = ContentView(onModelGenerated: { usdzPath in
      resolve(usdzPath.path)
    })

    let vc = UIHostingController(rootView: scanView)
    rootVC.present(vc, animated: true)
  }
}
}
