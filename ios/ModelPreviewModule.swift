@objc(ModelPreviewModule)
class ModelPreviewModule: NSObject {
  private var lastPath: String?

  @objc func showModelPreview(_ filePath: String) {
    lastPath = filePath
    DispatchQueue.main.async {
      let url = URL(fileURLWithPath: filePath)
      let preview = QLPreviewController()
      let item = ModelPreviewItem(url: url)
      preview.dataSource = item

      if let rootVC = UIApplication.shared.keyWindow?.rootViewController {
        rootVC.present(preview, animated: true)
      }
    }
  }

  @objc func getLastGeneratedPath(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    if let path = lastPath {
      resolve(path)
    } else {
      reject("no_path", "No se encontró un modelo reciente", nil)
    }
  }
}
