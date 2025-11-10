import SwiftUI
import RealityKit

struct CaptureView: View {
    let session: ObjectCaptureSession
    let passCount: Int
    let maxPasses: Int
    let onReset: () -> Void
    
    var body: some View {
        ZStack {
            ObjectCaptureView(session: session)
                .edgesIgnoringSafeArea(.all)
            
            VStack {
                // Botón de reinicio
                HStack {
                    Button(action: onReset) {
                        HStack {
                            Image(systemName: "arrow.uturn.backward.circle.fill")
                                .font(.title3)
                            Text("Reiniciar")
                                .font(.subheadline)
                        }
                        .padding(.vertical, 8)
                        .padding(.horizontal, 18)
                        .background(Color.red)
                        .foregroundColor(.white)
                        .clipShape(Capsule())
                        .shadow(color: .red.opacity(0.2), radius: 4, x: 0, y: 2)
                    }
                    .padding(.leading, 12)
                    .padding(.top, 12)
                    Spacer()
                }
                
                Spacer()
                
                // Controles inferiores
                VStack(spacing: 18) {
                    if session.state == .ready || session.state == .detecting {
                        Button(action: {
                            session.state == .ready ? _ = session.startDetecting() : session.startCapturing()
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "camera.viewfinder")
                                    .font(.title2)
                                Text(session.state == .ready ? "Iniciar Escaneo" : "Capturar")
                                    .font(.title2.bold())
                            }
                            .padding(.vertical, 12)
                            .padding(.horizontal, 32)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .clipShape(Capsule())
                            .shadow(color: .blue.opacity(0.2), radius: 4, x: 0, y: 2)
                        }
                    }
                    
                    HStack(spacing: 8) {
                        Image(systemName: "arrow.triangle.2.circlepath")
                            .foregroundColor(.yellow)
                        Text("Pasada \(passCount) de \(maxPasses)")
                            .bold()
                            .foregroundColor(.yellow)
                        Image(systemName: "info.circle")
                            .foregroundColor(.yellow)
                        Text("Estado: \(session.state.label)")
                            .bold()
                            .foregroundColor(.yellow)
                    }
                    .padding(.bottom, 4)
                }
                .frame(maxWidth: .infinity)
                .padding(.horizontal, 8)
                .padding(.bottom, 32)
                .multilineTextAlignment(.center)
            }
        }
    }
}
