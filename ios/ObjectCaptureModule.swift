import Foundation
import SwiftUI

@objc(ObjectCaptureModule)
class ObjectCaptureModule: NSObject {

  @objc
  func startObjectCapture(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      // Asegura que haya una ventana activa visible
      guard
        let scene = UIApplication.shared.connectedScenes
          .compactMap({ $0 as? UIWindowScene }).first,
        let window = scene.windows.first(where: { $0.isKeyWindow }),
        let rootVC = window.rootViewController
      else {
        reject("NO_ROOT", "No se encontró una ventana activa para presentar el VC", nil)
        return
      }

      let scanView = ContentView()
      let vc = UIHostingController(rootView: scanView)
      rootVC.present(vc, animated: true)

      // Simulación del path resultante
      resolve("file:///dummy/path/model.usdz")
    }
  }
}
