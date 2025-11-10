import SwiftUI
import RealityKit

struct ContentView: View {
    // MARK: - Properties
    @State private var session: ObjectCaptureSession?
    @State private var rootImageFolder: URL?
    @State private var modelFolderPath: URL?
    @State private var photogrammetrySession: PhotogrammetrySession?
    @State private var isProgressing = false
    @State private var quickLookIsPresented = false
    @State private var showInstructions = false
    @State private var passCount: Int = 0
    
    private let maxPasses = 2
    
    var modelPath: URL? {
        return modelFolderPath?.appending(path: "model.usdz")
    }
    
    var body: some View {
        ZStack {
            // Botón de ayuda (en capa superior)
            VStack {
                HStack {
                    Spacer()
                    Button(action: { showInstructions = true }) {
                        Image(systemName: "questionmark.circle.fill")
                            .font(.title3)
                            .foregroundColor(.black)
                            .padding(8)
                            .background(Color.white.opacity(0.7))
                            .clipShape(Circle())
                            .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                    }
                    .padding(.trailing, 12)
                    .padding(.top, 12)
                }
                Spacer()
            }
            .zIndex(1)
            
            // Contenido principal
            VStack(spacing: 0) {
                // Contenido principal según el estado
                Group {
                    if session == nil && !isProgressing && !quickLookIsPresented {
                        InitialView(onStart: startNewScanWorkflow)
                    } else if let session = session {
                        CaptureView(
                            session: session,
                            passCount: passCount,
                            maxPasses: maxPasses,
                            onReset: resetAll
                        )
                    }
                }
            }
            
            // Overlay de progreso
            if isProgressing {
                ProgressOverlay()
            }
        }
        // Modales
        .sheet(isPresented: $quickLookIsPresented) {
            if let modelPath = modelPath {
                ARQuickLookView(modelFile: modelPath) {
                    resetAll()
                }
            }
        }
        .sheet(isPresented: $showInstructions) {
            InstructionsView()
        }
        // Observadores de cambios
        .onChange(of: session?.userCompletedScanPass) { _, newValue in
            handleScanPassCompletion(newValue)
        }
        .onChange(of: session?.state) { _, newState in
            if newState == .completed {
                Task { await startReconstruction() }
            }
        }
    }
    
    // MARK: Funciones Auxiliares
    
    func startNewScanWorkflow() {
        passCount = 0
        
        // 1.1) Crear carpeta raíz Scans/<timestamp>/
        guard let baseScanDir = createTimestampedScanFolder() else {
            print("❌ No pude crear la carpeta raíz de escaneo.")
            return
        }
        
        // 1.2) Definir carpeta de imágenes y de modelos
        rootImageFolder = baseScanDir.appendingPathComponent("Images/", isDirectory: true)
        modelFolderPath   = baseScanDir.appendingPathComponent("Models/",  isDirectory: true)
        
        // 1.3) Crear físicamente esas carpetas
        do {
            try FileManager.default.createDirectory(
                at: rootImageFolder!,
                withIntermediateDirectories: true
            )
            try FileManager.default.createDirectory(
                at: modelFolderPath!,
                withIntermediateDirectories: true
            )
        } catch {
            print("❌ Error creando carpetas raíz: \(error)")
            return
        }
        
        // 1.4) Inicializar y arrancar la sesión de Object Capture
        session = ObjectCaptureSession()
        session?.start(imagesDirectory: rootImageFolder!)
    }
    
    private func handleScanPassCompletion(_ newValue: Bool?) {
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

    private func createTimestampedScanFolder() -> URL? {
        guard let documents = try? FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        ) else { return nil }
        
        let scansRoot = documents.appendingPathComponent("Scans/", isDirectory: true)
        if !FileManager.default.fileExists(atPath: scansRoot.path) {
            do {
                try FileManager.default.createDirectory(
                    at: scansRoot,
                    withIntermediateDirectories: true
                )
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
            try FileManager.default.createDirectory(
                at: newScanDir,
                withIntermediateDirectories: true
            )
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
        
        // 4.2) Mostrar overlay de progreso
        isProgressing = true
        
        do {
            var config = PhotogrammetrySession.Configuration()
            config.featureSensitivity = .high
            config.sampleOrdering    = .sequential
            
            let session = try PhotogrammetrySession(
                input: allImagesFolder,   // <-- Uso directo de Images/
                configuration: config
            )
            photogrammetrySession = session
            
            let request = PhotogrammetrySession.Request
                .modelFile(
                    url: modelDir.appendingPathComponent("model.usdz"),
                    detail: .reduced
                )
            
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
                    print("✅ Photogrammetry completada. Mostrando QuickLook.")
                    isProgressing = false
                    photogrammetrySession = nil
                    quickLookIsPresented = true
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
    
    func resetAll() {
        session = nil
        photogrammetrySession = nil
        isProgressing = false
        quickLookIsPresented = false
        passCount = 0
        
        if let documents = try? FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true) {
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



