import SwiftUI
import RealityKit

struct ContentView: View {
    var onModelGenerated: (URL) -> Void = { _ in }
    @State private var session: ObjectCaptureSession?
    @State private var rootImageFolder: URL?
    @State private var modelFolderPath: URL?

    @State private var photogrammetrySession: PhotogrammetrySession?
    @State private var isProgressing = false
    @State private var quickLookIsPresented = false

    @State private var passCount: Int = 0
    private let maxPasses = 1

    var modelPath: URL? {
        return modelFolderPath?.appending(path: "model.usdz")
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            VStack {
                if session == nil && !isProgressing && !quickLookIsPresented {
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
                } else if session != nil {
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
                    Spacer(minLength: 0)
                    Spacer(minLength: 0)
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
            print("📸 Pasada \(passCount) completada.")

            if passCount < maxPasses {
                if #available(iOS 17.0, *) {
                    print("➡️ Avanzando a la siguiente pasada con beginNewScanPass()")
                    session?.beginNewScanPass()
                } else {
                    print("⚠️ iOS < 17: no es posible continuar la misma sesión sin reiniciar.")
                }
            } else {
                print("✅ Todas las pasadas completadas. Llamando a session.finish()")
                session?.finish()
            }
        }
        .onChange(of: session?.state) { _, newState in
            if newState == .completed {
                print("🔄 session.state llegó a .completed → arrancando Photogrammetry")
                Task { await startReconstruction() }
            }
        }
    }

    func startNewScanWorkflow() {
        passCount = 0

        guard let baseScanDir = createTimestampedScanFolder() else {
            print("❌ No pude crear la carpeta raíz de escaneo.")
            return
        }

        rootImageFolder = baseScanDir.appendingPathComponent("Images/", isDirectory: true)
        modelFolderPath = baseScanDir.appendingPathComponent("Models/", isDirectory: true)

        do {
            try FileManager.default.createDirectory(at: rootImageFolder!, withIntermediateDirectories: true)
            try FileManager.default.createDirectory(at: modelFolderPath!, withIntermediateDirectories: true)
        } catch {
            print("❌ Error creando carpetas raíz: \(error)")
            return
        }

        session = ObjectCaptureSession()
        session?.start(imagesDirectory: rootImageFolder!)
    }

    private func createTimestampedScanFolder() -> URL? {
        guard let documents = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true) else { return nil }

        let scansRoot = documents.appendingPathComponent("Scans/", isDirectory: true)
        if !FileManager.default.fileExists(atPath: scansRoot.path) {
            do {
                try FileManager.default.createDirectory(at: scansRoot, withIntermediateDirectories: true)
            } catch {
                print("❌ Error creando carpeta Scans/: \(error)")
                return nil
            }
        }

        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let timestamp = formatter.string(from: Date())

        let newScanDir = scansRoot.appendingPathComponent(timestamp, isDirectory: true)
        do {
            try FileManager.default.createDirectory(at: newScanDir, withIntermediateDirectories: true)
            return newScanDir
        } catch {
            print("❌ Error creando carpeta con timestamp: \(error)")
            return nil
        }
    }

    private func startReconstruction() async {
        guard let allImagesFolder = rootImageFolder,
              let modelDir = modelFolderPath else {
            print("❌ No tengo rutas para Photogrammetry.")
            return
        }

        isProgressing = true

        do {
            var config = PhotogrammetrySession.Configuration()
            config.featureSensitivity = .high
            config.sampleOrdering = .sequential

            let session = try PhotogrammetrySession(input: allImagesFolder, configuration: config)
            photogrammetrySession = session

            let request = PhotogrammetrySession.Request.modelFile(url: modelDir.appendingPathComponent("model.usdz"), detail: .reduced)

            try session.process(requests: [request])

            for try await output in session.outputs {
                switch output {
                case .requestError(let err):
                    print("📛 Error en Photogrammetry: \(err)")
                    isProgressing = false
                    photogrammetrySession = nil
                    return
                case .processingCancelled:
                    print("⚠️ Photogrammetry cancelada.")
                    isProgressing = false
                    photogrammetrySession = nil
                    return
                case .processingComplete:
                    print("✅ Photogrammetry completada. Mostrando vista nativa.")
                    isProgressing = false
                    photogrammetrySession = nil
                    let finalModelPath = modelDir.appendingPathComponent("model.usdz")
                    showNativeModelView(with: finalModelPath)
                    await uploadUSDZToBackend(fileURL: finalModelPath)
                default:
                    break
                }
            }
        } catch {
            print("❌ Al lanzar PhotogrammetrySession: \(error)")
            isProgressing = false
            photogrammetrySession = nil
        }
    }

    private func showNativeModelView(with url: URL) {
        guard FileManager.default.fileExists(atPath: url.path) else {
            print("❌ El archivo .usdz no existe en: \(url.path)")
            return
        }

        let controller = ModelPreviewController(modelPath: url)

        if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let rootVC = scene.windows.first?.rootViewController {
            rootVC.present(controller, animated: true)
        } else {
            print("❌ No se pudo presentar ModelPreviewController")
        }
    }

    func resetAll() {
        session = nil
        photogrammetrySession = nil
        isProgressing = false
        quickLookIsPresented = false
        passCount = 0

        if let documents = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true) {
            let scansRoot = documents.appendingPathComponent("Scans/", isDirectory: true)
            if FileManager.default.fileExists(atPath: scansRoot.path) {
                do {
                    try FileManager.default.removeItem(at: scansRoot)
                    print("🗑️ Carpeta Scans/ borrada.")
                } catch {
                    print("⚠️ Error borrando Scans/: \(error)")
                }
            }
        }

        rootImageFolder = nil
        modelFolderPath = nil
    }
}

func uploadUSDZToBackend(fileURL: URL) async {
    print("Comenzando la subida del modelo al backend")
    let uploadURL = URL(string: "https://trevian-server.vercel.app/models/upload")!

    var request = URLRequest(url: uploadURL)
    request.httpMethod = "POST"

    let boundary = UUID().uuidString
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

    guard let fileData = try? Data(contentsOf: fileURL) else {
        print("❌ No se pudo leer el archivo USDZ.")
        return
    }

    var body = Data()
    let filename = "modelo.usdz"
    let mimetype = "model/vnd.usdz+zip"

    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
    body.append("Content-Type: \(mimetype)\r\n\r\n".data(using: .utf8)!)
    body.append(fileData)
    body.append("\r\n".data(using: .utf8)!)
    body.append("--\(boundary)--\r\n".data(using: .utf8)!)

    request.httpBody = body

    do {
        let (data, response) = try await URLSession.shared.data(for: request)
        if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
            print("✅ Modelo subido con éxito.")
        } else {
            print("❌ Error en la respuesta: \(response)")
            if let string = String(data: data, encoding: .utf8) {
                print("ℹ️ Backend dijo: \(string)")
            }
        }
    } catch {
        print("❌ Error al subir el archivo: \(error.localizedDescription)")
    }
}
