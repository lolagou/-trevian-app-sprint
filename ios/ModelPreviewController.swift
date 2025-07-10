import UIKit
import RealityKit
import SwiftUI

class ModelPreviewController: UIViewController {
    let modelPath: URL

    init(modelPath: URL) {
        self.modelPath = modelPath
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.black

        let stack = UIStackView()
        stack.axis = .vertical
        stack.distribution = .fillEqually
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            stack.topAnchor.constraint(equalTo: view.topAnchor, constant: 60),
            stack.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -60),
        ])

        let orientations: [(String, SIMD3<Float>)] = [
            ("Frontal", .zero),
            ("Lateral", SIMD3<Float>(0, .pi/2, 0)),
            ("Superior", SIMD3<Float>(-.pi/2, 0, 0))
        ]

        for (label, rotation) in orientations {
            let arView = ARView(frame: .zero)
            arView.translatesAutoresizingMaskIntoConstraints = false
            arView.automaticallyConfigureSession = true
            arView.environment.sceneUnderstanding.options.insert(.occlusion)
            arView.renderOptions.insert(.disableMotionBlur)

            let box = try? Entity.loadModel(contentsOf: modelPath)
            if let entity = box {
                entity.setOrientation(simd_quatf(angle: rotation.x, axis: [1,0,0]), relativeTo: nil)
                entity.setOrientation(simd_quatf(angle: rotation.y, axis: [0,1,0]), relativeTo: nil)
                entity.setOrientation(simd_quatf(angle: rotation.z, axis: [0,0,1]), relativeTo: nil)
                let anchor = AnchorEntity(world: .zero)
                anchor.addChild(entity)
                arView.scene.anchors.append(anchor)
            }

            let labelView = UILabel()
            labelView.text = label
            labelView.textColor = .white
            labelView.textAlignment = .center
            labelView.font = UIFont.boldSystemFont(ofSize: 14)

            let container = UIStackView(arrangedSubviews: [arView, labelView])
            container.axis = .vertical
            container.spacing = 4
            stack.addArrangedSubview(container)
        }
    }
}
