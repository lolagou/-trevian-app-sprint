import SwiftUI

struct InitialView: View {
    let onStart: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Tips para un escaneo preciso:")
                .font(.headline)
                .foregroundColor(.accentColor)
            
            VStack(alignment: .leading, spacing: 6) {
                Label("Usa fondo neutro y buena iluminación", systemImage: "lightbulb")
                Label("Evita reflejos y sombras", systemImage: "eye")
                Label("Gira suavemente sobre la planta del pie", systemImage: "camera")
            }
            .font(.subheadline)
            .foregroundColor(.primary)
            .padding(.horizontal, 8)
            
            Button("Iniciar Escaneo") {
                onStart()
            }
            .font(.title2.bold())
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .clipShape(Capsule())
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemBackground).opacity(0.95))
        .cornerRadius(18)
        .shadow(color: .black.opacity(0.18), radius: 12, x: 0, y: 6)
        .padding()
    }
}
