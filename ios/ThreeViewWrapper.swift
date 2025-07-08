//
//  ThreeViewWrapper.swift
//  trevianappsprint
//
//  Created by Lola Nuñez Gouget on 7/7/25.
//

import SwiftUI

struct ThreeViewWrapper: UIViewControllerRepresentable {
    let modelPath: URL

    func makeUIViewController(context: Context) -> ModelPreviewController {
        return ModelPreviewController(modelPath: modelPath)
    }

    func updateUIViewController(_ uiViewController: ModelPreviewController, context: Context) {}
}
