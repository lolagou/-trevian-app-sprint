import SwiftUI
import RealityKit

struct ModelPreviewView: View {
    let usdzPath: String

    var body: some View {
        VStack(spacing: 20) {
            ModelPreviewBox(title: "Vista frontal", cameraPosition: [0, 0, 3], usdzPath: usdzPath)
            ModelPreviewBox(title: "Vista lateral", cameraPosition: [3, 0, 0], usdzPath: usdzPath)
            ModelPreviewBox(title: "Vista superior", cameraPosition: [0, 3, 0], usdzPath: usdzPath)
        }
        .padding()
        .background(Color.black)
    }
}

struct ModelPreviewBox: View {
    let title: String
    let cameraPosition: SIMD3<Float>
    let usdzPath: String

    var body: some View {
        VStack {
            ARViewContainer(cameraPosition: cameraPosition, usdzPath: usdzPath)
                .frame(height: 200)
                .clipShape(RoundedRectangle(cornerRadius: 10))
            Text(title)
                .foregroundColor(.white)
                .font(.caption)
        }
    }
}

struct ARViewContainer: UIViewRepresentable {
    let cameraPosition: SIMD3<Float>
    let usdzPath: String

    func makeUIView(context: Context) -> ARView {
        let arView = ARView(frame: .zero)
        arView.environment.background = .color(.black)

        // Cargar modelo dinámicamente desde path
        let modelURL = URL(fileURLWithPath: usdzPath)
        let entity = try! ModelEntity.loadModel(contentsOf: modelURL)
        entity.generateCollisionShapes(recursive: true)
        let anchor = AnchorEntity(world: .zero)
        anchor.addChild(entity)
        arView.scene.anchors.append(anchor)

        // Posicionar cámara
        let cameraAnchor = AnchorEntity(world: cameraPosition)
        let camera = PerspectiveCamera()
        cameraAnchor.addChild(camera)
        arView.scene.anchors.append(cameraAnchor)
        arView.cameraMode = .nonAR

        return arView
    }

    func updateUIView(_ uiView: ARView, context: Context) {}
}
