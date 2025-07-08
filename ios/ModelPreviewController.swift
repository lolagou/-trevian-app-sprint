import UIKit
import RealityKit
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

        // 🎨 Colores Trevian
        let backgroundColor = UIColor(red: 2/255, green: 0, blue: 26/255, alpha: 1) // #02001A
        let accentColor = UIColor(red: 109/255, green: 1, blue: 213/255, alpha: 1)  // #6DFFD5
        let textColor = UIColor(red: 203/255, green: 255/255, blue: 239/255, alpha: 1) // #CBFFEF

        view.backgroundColor = backgroundColor

        // 🧩 Título
        let titleLabel = UILabel()
        titleLabel.text = "Acomodá tu modelo"
        titleLabel.textColor = textColor
        titleLabel.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])

        // 🧱 Stack con vistas
        let stack = UIStackView()
        stack.axis = .vertical
        stack.alignment = .fill
        stack.distribution = .equalSpacing
        stack.spacing = 24
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            stack.bottomAnchor.constraint(lessThanOrEqualTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -100)
        ])

        let labels = ["Frontal", "Lateral", "Superior"]
        let rotations: [simd_quatf] = [
            simd_quatf(angle: 0, axis: [0, 1, 0]),
            simd_quatf(angle: .pi / 2, axis: [0, 1, 0]),
            simd_quatf(angle: -.pi / 2, axis: [1, 0, 0])
        ]

        do {
            let entity = try Entity.loadModel(contentsOf: modelPath)

            for (index, labelText) in labels.enumerated() {
                let container = UIView()
                container.backgroundColor = backgroundColor
                container.layer.cornerRadius = 20
                container.layer.borderWidth = 1
                container.layer.borderColor = textColor.withAlphaComponent(0.2).cgColor
                container.translatesAutoresizingMaskIntoConstraints = false
                container.heightAnchor.constraint(equalToConstant: 250).isActive = true

                let arView = ARView(frame: .zero)
                arView.translatesAutoresizingMaskIntoConstraints = false
                arView.automaticallyConfigureSession = false
                container.addSubview(arView)

                NSLayoutConstraint.activate([
                    arView.topAnchor.constraint(equalTo: container.topAnchor),
                    arView.bottomAnchor.constraint(equalTo: container.bottomAnchor),
                    arView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
                    arView.trailingAnchor.constraint(equalTo: container.trailingAnchor)
                ])

                let anchor = AnchorEntity()
                let clone = entity.clone(recursive: true)
                clone.transform.rotation = rotations[index]
                anchor.addChild(clone)
                anchor.addChild(createXYZAxes())
                arView.scene.anchors.append(anchor)
                arView.installGestures([.rotation, .translation], for: clone)

                let label = UILabel()
                label.text = labelText
                label.textColor = textColor
                label.font = UIFont.systemFont(ofSize: 14, weight: .medium)
                label.textAlignment = .center
                label.translatesAutoresizingMaskIntoConstraints = false

                container.addSubview(label)
                NSLayoutConstraint.activate([
                    label.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -8),
                    label.centerXAnchor.constraint(equalTo: container.centerXAnchor)
                ])

                stack.addArrangedSubview(container)
            }

        } catch {
            print("❌ Error al cargar modelo: \(error)")
        }

        // 🔘 Botón CONTINUAR
        let continueButton = UIButton(type: .system)
        continueButton.setTitle("CONTINUAR", for: .normal)
        continueButton.setTitleColor(.black, for: .normal)
        continueButton.backgroundColor = accentColor
        continueButton.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .bold)
        continueButton.layer.cornerRadius = 12
        continueButton.translatesAutoresizingMaskIntoConstraints = false
        continueButton.addTarget(self, action: #selector(continuePressed), for: .touchUpInside)
        view.addSubview(continueButton)

        NSLayoutConstraint.activate([
            continueButton.heightAnchor.constraint(equalToConstant: 52),
            continueButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 32),
            continueButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -32),
            continueButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20)
        ])
    }

    @objc func continuePressed() {
        dismiss(animated: true) {
            NotificationCenter.default.post(
                name: Notification.Name("goToResult"),
                object: nil,
                userInfo: ["filePath": self.modelPath.path]
            )
        }
    }

    func createXYZAxes(scale: Float = 0.1) -> Entity {
        let axesEntity = Entity()

        let x = ModelEntity(
            mesh: .generateBox(size: [0.2, 0.005, 0.005]),
            materials: [SimpleMaterial(color: .red, isMetallic: false)]
        )
        x.position = [0.1, 0, 0]

        let y = ModelEntity(
            mesh: .generateBox(size: [0.005, 0.2, 0.005]),
            materials: [SimpleMaterial(color: .green, isMetallic: false)]
        )
        y.position = [0, 0.1, 0]

        let z = ModelEntity(
            mesh: .generateBox(size: [0.005, 0.005, 0.2]),
            materials: [SimpleMaterial(color: .blue, isMetallic: false)]
        )
        z.position = [0, 0, 0.1]

        axesEntity.addChild(x)
        axesEntity.addChild(y)
        axesEntity.addChild(z)

        return axesEntity
    }
}
