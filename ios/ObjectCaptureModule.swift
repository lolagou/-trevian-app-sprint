//
//  ObjectCaptureModule.swift
//  trevianappsprint
//
//  Created by Lola Nuñez Gouget on 2/8/25.
//

import Foundation
import SwiftUI
import React   // <- Necesario para RCTPromiseResolveBlock / Reject

@objc(ObjectCaptureModule)
class ObjectCaptureModule: NSObject {

  private var presentedVC: UIViewController?

  /// Presenta la UI de escaneo y resuelve con la ruta (file://) del .usdz cuando está listo.
  /// Uso en RN: `const uri = await NativeModules.ObjectCaptureModule.startObjectCapture();`
  @objc
  func startObjectCapture(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {

    DispatchQueue.main.async {
      // Buscar una ventana/VC para presentar la UI
      guard
        let scene = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first,
        let window = scene.windows.first(where: { $0.isKeyWindow }),
        let rootVC = window.rootViewController
      else {
        reject("NO_ROOT", "No se encontró una ventana activa para presentar el VC", nil)
        return
      }

      // Construimos la vista pasando el callback onModelReady
      let view = ContentView(onModelReady: { [weak self] (url: URL) in
          let uri = "file://\(url.path)"
          print("🔗 Enviando a RN la ruta del USDZ:", uri)

          resolve(uri)

          self?.presentedVC?.dismiss(animated: true)
          self?.presentedVC = nil

      })

      let host = UIHostingController(rootView: view)
      self.presentedVC = host
      rootVC.present(host, animated: true)
    }
  }
}
