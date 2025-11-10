import SwiftUI

struct ProgressOverlay: View {
    var body: some View {
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
                .background(Color.black.opacity(0.8))
                .cornerRadius(12)
                .padding(32)
            }
    }
}
