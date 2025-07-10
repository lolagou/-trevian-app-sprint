import SwiftUI
import RealityKit
import UIKit

struct ContentView: View {
    var onModelGenerated: (URL) -> Void = { _ in }

    @State private var session: ObjectCaptureSession?
    @State private var rootImageFolder: URL?
    @State private var modelFolderPath: URL?

    @State private var photogrammetrySession: PhotogrammetrySession?
    @State private var isProgressing = false
    @State private var showCaptureView = true  // ✅ NUEVO: controla si se muestra la vista de captura

    @State private var passCount: Int = 0
    private let maxPasses = 1

    var modelPath: URL? {
        return modelFolderPath?.appendingPathComponent("model.usdz")
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            VStack(spacing: 16) {
                if session == nil && !isProgressing {
                    Spacer()
                    Button("Iniciar Escaneo") {
                        startNewScanWorkflow()
                    }
                    .font(.title2.bold())
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .clipShape(Capsule())
                    Spacer()
                } else if session != nil && showCaptureView {
                    ObjectCaptureView(session: session!)
                        .edgesIgnoringSafeArea(.all)

                    VStack(spacing: 16) {
                        if session!.state == .ready || session!.state == .detecting {
                            CreateButton(session: session!)
                        }

                        Text("Pasada \(passCount) de \(maxPasses) — Estado: \(session!.state.label)")
                            .bold()
                            .foregroundColor(.yellow)
                            .padding(.bottom, 8)

                        Button("Reiniciar Escaneo") {
                            resetAll()
                        }
                        .font(.subheadline)
                        .padding(.vertical, 6)
                        .padding(.horizontal, 12)
                        .background(Color.red.opacity(0.8))
                        .foregroundColor(.white)
                        .clipShape(Capsule())
                        .padding(.top, 8)
                    }
                    .background(Color.black.opacity(0.5))
                } else if isProgressing {
                    Spacer()
                }
            }

            if isProgressing {
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .overlay {
                        VStack(spacing: 16) {
                            ProgressView("Reconstruyendo modelo…")
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .foregroundColor(.white)
                                .padding()
                            Text("Por favor, espera mientras se genera el modelo en 3D.")
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 24)
                        }
                        .background(Color.black.opacity(1))
                        .cornerRadius(12)
                        .padding(32)
                    }
            }
        }
        .onChange(of: session?.userCompletedScanPass) { _, newValue in
            guard let passed = newValue, passed else { return }
            passCount += 1
            if passCount < maxPasses {
                if #available(iOS 17.0, *) {
                    session?.beginNewScanPass()
                }
            } else {
                session?.finish()
            }
        }
        .onChange(of: session?.state) { _, newState in
            if newState == .completed {
                showCaptureView = false  // ✅ EVITA crash de session deinitialized
                Task { await startReconstruction() }
            }
        }
    }

    func startNewScanWorkflow() {
        passCount = 0
        guard let baseScanDir = createTimestampedScanFolder() else { return }

        rootImageFolder = baseScanDir.appendingPathComponent("Images/", isDirectory: true)
        modelFolderPath = baseScanDir.appendingPathComponent("Models/", isDirectory: true)

        try? FileManager.default.createDirectory(at: rootImageFolder!, withIntermediateDirectories: true)
        try? FileManager.default.createDirectory(at: modelFolderPath!, withIntermediateDirectories: true)

        session = ObjectCaptureSession()
        session?.start(imagesDirectory: rootImageFolder!)
    }

    func createTimestampedScanFolder() -> URL? {
        guard let documents = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true) else { return nil }
        let scansRoot = documents.appendingPathComponent("Scans/", isDirectory: true)
        try? FileManager.default.createDirectory(at: scansRoot, withIntermediateDirectories: true)
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let newScanDir = scansRoot.appendingPathComponent(timestamp, isDirectory: true)
        try? FileManager.default.createDirectory(at: newScanDir, withIntermediateDirectories: true)
        return newScanDir
    }

    func startReconstruction() async {
        guard let allImagesFolder = rootImageFolder,
              let modelDir = modelFolderPath else { return }

        isProgressing = true

        do {
            var config = PhotogrammetrySession.Configuration()
            config.featureSensitivity = .high
            config.sampleOrdering = .sequential

            let session = try PhotogrammetrySession(input: allImagesFolder, configuration: config)
            photogrammetrySession = session

            let request = PhotogrammetrySession.Request.modelFile(
                url: modelDir.appendingPathComponent("model.usdz"),
                detail: .reduced
            )

            try session.process(requests: [request])

            for try await output in session.outputs {
                switch output {
                case .processingComplete:
                    isProgressing = false
                    let finalModelURL = modelDir.appendingPathComponent("model.usdz")

                    // ✅ Mostramos el preview del modelo con ejes en vista nativa
                    DispatchQueue.main.async {
                        let preview = ModelPreviewController(modelPath: finalModelURL)
                        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                           let rootVC = windowScene.windows.first?.rootViewController {
                            rootVC.present(preview, animated: true, completion: nil)
                        } else {
                        print("❌ No se encontró RootVC para presentar ModelPreviewController")
    }
                    }

                case .requestError(_, let err):
                    print("⚠️ Photogrammetry Error: \(err)")
                    isProgressing = false
                    photogrammetrySession = nil

                case .processingCancelled:
                    print("⚠️ Photogrammetry cancelada.")
                    isProgressing = false
                    photogrammetrySession = nil

                default:
                    break
                }
            }
        } catch {
            print("❌ Photogrammetry falló: \(error)")
            isProgressing = false
        }
    }

    func resetAll() {
        session = nil
        photogrammetrySession = nil
        isProgressing = false
        showCaptureView = true // ✅ Habilitar vista de nuevo
        passCount = 0

        if let documents = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true) {
            let scansRoot = documents.appendingPathComponent("Scans/", isDirectory: true)
            try? FileManager.default.removeItem(at: scansRoot)
        }

        rootImageFolder = nil
        modelFolderPath = nil
    }
}
