import UIKit
import RealityKit
import SwiftUI
import ARKit

class ModelPreviewController: UIViewController {
    private let modelPath: URL

    init(modelPath: URL) {
        self.modelPath = modelPath
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black

        let stack = UIStackView()
        stack.axis = .vertical
        stack.alignment = .fill
        stack.distribution = .fillEqually
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false

        let frontView = ARView(frame: .zero)
        let sideView = ARView(frame: .zero)
        let topView  = ARView(frame: .zero)

        [frontView, sideView, topView].forEach { arView in
            stack.addArrangedSubview(arView)
            arView.backgroundColor = .black
            arView.automaticallyConfigureSession = false
            arView.environment.sceneUnderstanding.options.insert(.occlusion)
            arView.renderOptions.insert(.disableMotionBlur)
        }

        view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            stack.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -80)
        ])

        let labels = ["Vista Frontal", "Vista Lateral", "Vista Superior"]
        for (index, label) in labels.enumerated() {
            let text = UILabel()
            text.text = label
            text.textColor = .white
            text.textAlignment = .center
            text.font = UIFont.systemFont(ofSize: 14, weight: .medium)
            text.translatesAutoresizingMaskIntoConstraints = false
            view.addSubview(text)
            NSLayoutConstraint.activate([
                text.topAnchor.constraint(equalTo: stack.arrangedSubviews[index].bottomAnchor, constant: -24),
                text.centerXAnchor.constraint(equalTo: stack.arrangedSubviews[index].centerXAnchor)
            ])
        }

        do {
            let entity = try Entity.loadModel(contentsOf: modelPath)

            // --- Vista Frontal ---
            let frontAnchor = AnchorEntity()
            frontAnchor.addChild(entity.clone(recursive: true))
            frontAnchor.addChild(createXYZAxes())
            frontView.scene.anchors.append(frontAnchor)

            // --- Vista Lateral ---
            let sideAnchor = AnchorEntity()
            let sideEntity = entity.clone(recursive: true)
            sideEntity.transform.rotation = simd_quatf(angle: .pi / 2, axis: [0, 1, 0])
            sideAnchor.addChild(sideEntity)
            sideAnchor.addChild(createXYZAxes())
            sideView.scene.anchors.append(sideAnchor)

            // --- Vista Superior ---
            let topAnchor = AnchorEntity()
            let topEntity = entity.clone(recursive: true)
            topEntity.transform.rotation = simd_quatf(angle: -.pi / 2, axis: [1, 0, 0])
            topAnchor.addChild(topEntity)
            topAnchor.addChild(createXYZAxes())
            topView.scene.anchors.append(topAnchor)

        } catch {
            print("❌ Error cargando modelo: \(error)")
        }
    }

    // MARK: - Ejes XYZ generados por código
    func createXYZAxes(scale: Float = 0.1) -> Entity {
        let axesEntity = Entity()

        // Eje X - rojo
        let xMesh = MeshResource.generateBox(size: [0.2, 0.005, 0.005])
        let xMaterial = SimpleMaterial(color: .red, isMetallic: false)
        let xEntity = ModelEntity(mesh: xMesh, materials: [xMaterial])
        xEntity.position = [0.1, 0, 0]
        axesEntity.addChild(xEntity)

        // Eje Y - verde
        let yMesh = MeshResource.generateBox(size: [0.005, 0.2, 0.005])
        let yMaterial = SimpleMaterial(color: .green, isMetallic: false)
        let yEntity = ModelEntity(mesh: yMesh, materials: [yMaterial])
        yEntity.position = [0, 0.1, 0]
        axesEntity.addChild(yEntity)

        // Eje Z - azul
        let zMesh = MeshResource.generateBox(size: [0.005, 0.005, 0.2])
        let zMaterial = SimpleMaterial(color: .blue, isMetallic: false)
        let zEntity = ModelEntity(mesh: zMesh, materials: [zMaterial])
        zEntity.position = [0, 0, 0.1]
        axesEntity.addChild(zEntity)

        return axesEntity
    }
}
