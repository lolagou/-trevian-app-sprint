@objc(ObjectCaptureModule)
class ObjectCaptureModule: NSObject {
  @objc
  func startObjectCapture(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      // Aquí lanzás el ViewController que contiene tu flujo Swift completo
      let rootVC = UIApplication.shared.windows.first?.rootViewController
      let swiftVC = UIHostingController(rootView: ContentView())
      rootVC?.present(swiftVC, animated: true, completion: nil)

      // Para simplificar: devuelve una URL ficticia al JS
      resolve("file:///path/to/model.usdz")
    }
  }
}
