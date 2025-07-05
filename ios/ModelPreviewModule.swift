import Foundation
import UIKit
import SwiftUI

@objc(ModelPreviewModule)
class ModelPreviewModule: NSObject {
  @objc
  func showModelPreview(_ usdzPath: String) {
    DispatchQueue.main.async {
      guard
        let scene = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first,
        let window = scene.windows.first(where: { $0.isKeyWindow }),
        let rootVC = window.rootViewController
      else { return }

      let previewVC = ModelPreviewController(modelPath: URL(fileURLWithPath: usdzPath))
      rootVC.present(previewVC, animated: true)
    }
  }
}
