//
//  ObjectCaptureModuleNew.swift
//
import Foundation
import SwiftUI
import React   // 👈 importante para RCTPromiseResolveBlock

@objc(ObjectCaptureModule)
class ObjectCaptureModule: NSObject {

  private var presentedVC: UIViewController?

  @objc
  func startObjectCapture(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {

    DispatchQueue.main.async {
      guard
        let scene = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first,
        let window = scene.windows.first(where: { $0.isKeyWindow }),
        let rootVC = window.rootViewController
      else {
        reject("NO_ROOT", "No se encontró una ventana activa para presentar el VC", nil)
        return
      }

      // 👇 Pasamos el callback onModelReady a la vista
      let view = ContentView(onModelReady: { [weak self] url in
        // Devolvemos a RN un file:// URI
        let uri = "file://\(url.path)"
        resolve(uri)

        // Opcional: cerrar la UI de escaneo automáticamente
        self?.presentedVC?.dismiss(animated: true)
        self?.presentedVC = nil
      })

      let host = UIHostingController(rootView: view)
      self.presentedVC = host
      rootVC.present(host, animated: true)
    }
  }
}
