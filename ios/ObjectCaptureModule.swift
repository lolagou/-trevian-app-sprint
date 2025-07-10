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

      // 👂 Escuchar la notificación desde ModelPreviewController
      NotificationCenter.default.addObserver(forName: Notification.Name("goToResult"), object: nil, queue: .main) { notification in
        if let filePath = notification.userInfo?["filePath"] as? String {
          print("📦 Swift bridge recibió ruta desde notificación: \(filePath)")
          resolve(filePath)
        } else {
          reject("NO_FILEPATH", "No se encontró la ruta del archivo", nil)
        }
      }

      // ✅ Presentar ContentView sin callback directo
      let scanView = ContentView()
      let vc = UIHostingController(rootView: scanView)
      rootVC.present(vc, animated: true)
    }
  }
}
