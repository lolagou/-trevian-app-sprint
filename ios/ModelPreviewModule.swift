import Foundation
import QuickLook
import UIKit

@objc(ModelPreviewModule)
class ModelPreviewModule: NSObject {
  private var lastPath: String?
  private var retainedDataSource: PreviewDataSource? // Evita que se deallocate

  @objc func showModelPreview(_ filePath: String) {
    lastPath = filePath
    DispatchQueue.main.async {
      let url = URL(fileURLWithPath: filePath)
      let preview = QLPreviewController()
      let item = ModelPreviewItem(url: url)
      let dataSource = PreviewDataSource(item: item)
      preview.dataSource = dataSource

      self.retainedDataSource = dataSource // 🔒 Retener la instancia

      if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
         let rootVC = scene.windows.first?.rootViewController {
        rootVC.present(preview, animated: true)
      } else {
        print("❌ No se pudo encontrar una ventana activa para presentar el preview.")
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

@objc func setLastGeneratedPath(_ filePath: String) {
  print("✅ setLastGeneratedPath llamado con: \(filePath)")
  lastPath = filePath
}


// MARK: - QLPreviewItem personalizado
class ModelPreviewItem: NSObject, QLPreviewItem {
  let previewItemURL: URL?

  init(url: URL) {
    self.previewItemURL = url
  }
}

// MARK: - DataSource para QuickLook
class PreviewDataSource: NSObject, QLPreviewControllerDataSource {
  let item: QLPreviewItem

  init(item: QLPreviewItem) {
    self.item = item
  }

  func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
    return 1
  }

  func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
    return item
  }
}
