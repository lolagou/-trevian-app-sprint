import SwiftUI

struct InstructionsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var currentPage = 0
    
    private let instructions = [
        InstructionPage(
            title: "Preparación",
            description: "Asegura un ambiente óptimo para el escaneo",
            icon: "lightbulb.fill",
            color: .blue,
            tips: [
                "Buena iluminación uniforme",
                "Superficie estable y limpia",
                "Pie en posición vertical",
                "Suela recta sobre superficie"
            ]
        ),
        InstructionPage(
            title: "Posicionamiento",
            description: "Coloca la suela correctamente",
            icon: "cube.fill",
            color: .purple,
            tips: [
                "Pie horizontal y estable",
                "Suela completamente visible",
                "Alinear suela con superficie",
                "Mantener posición firme"
            ]
        ),
        InstructionPage(
            title: "Durante el Escaneo",
            description: "Sigue el proceso paso a paso",
            icon: "camera.fill",
            color: .green,
            tips: [
                "Movimiento suave y continuo",
                "Completar ambas pasadas",
                "Mantener pie inmóvil",
                "Seguir guía en pantalla"
            ]
        ),
        InstructionPage(
            title: "Consejos Finales",
            description: "Obtén los mejores resultados",
            icon: "star.fill",
            color: .orange,
            tips: [
                "Evitar movimientos bruscos",
                "Capturar suela completa",
                "Verificar cada pasada",
                "Mantener pie estático"
            ]
        )
    ]
    
    var body: some View {
        ZStack {
            // Fondo
            Color(.systemBackground).edgesIgnoringSafeArea(.all)
            
            // Contenido principal
            VStack {
                // Botón de cerrar
                HStack {
                    Spacer()
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                }
                
                // Carrusel de instrucciones
                TabView(selection: $currentPage) {
                    ForEach(0..<instructions.count, id: \.self) { index in
                        InstructionPageView(instruction: instructions[index])
                            .tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: currentPage)
                
                // Navegación inferior
                VStack(spacing: 20) {
                    // Indicadores de página
                    HStack(spacing: 8) {
                        ForEach(0..<instructions.count, id: \.self) { index in
                            Circle()
                                .fill(currentPage == index ? Color.blue : Color.gray.opacity(0.3))
                                .frame(width: 8, height: 8)
                                .scaleEffect(currentPage == index ? 1.2 : 1)
                                .animation(.spring(), value: currentPage)
                        }
                    }
                    
                    // Botones de navegación
                    HStack(spacing: 40) {
                        Button {
                            withAnimation {
                                currentPage = max(currentPage - 1, 0)
                            }
                        } label: {
                            Image(systemName: "chevron.left.circle.fill")
                                .font(.title)
                                .foregroundColor(currentPage > 0 ? .blue : .gray)
                        }
                        .disabled(currentPage == 0)
                        
                        Button {
                            withAnimation {
                                currentPage = min(currentPage + 1, instructions.count - 1)
                            }
                        } label: {
                            Image(systemName: "chevron.right.circle.fill")
                                .font(.title)
                                .foregroundColor(currentPage < instructions.count - 1 ? .blue : .gray)
                        }
                        .disabled(currentPage == instructions.count - 1)
                    }
                }
                .padding(.bottom, 30)
            }
        }
    }
}

struct InstructionPage: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let icon: String
    let color: Color
    let tips: [String]
}

struct InstructionPageView: View {
    let instruction: InstructionPage
    
    var body: some View {
        VStack(spacing: 30) {
            Spacer()
            
            // Icono
            Image(systemName: instruction.icon)
                .font(.system(size: 60))
                .foregroundColor(instruction.color)
                .symbolEffect(.bounce, value: true)
            
            // Título y descripción
            VStack(spacing: 12) {
                Text(instruction.title)
                    .font(.title)
                    .bold()
                
                Text(instruction.description)
                    .font(.title3)
                    .foregroundColor(.secondary)
            }
            
            // Tips
            VStack(alignment: .leading, spacing: 16) {
                ForEach(instruction.tips, id: \.self) { tip in
                    HStack(spacing: 12) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(instruction.color)
                        Text(tip)
                            .font(.body)
                    }
                }
            }
            .padding(.top, 20)
            
            Spacer()
        }
        .padding(.horizontal, 30)
        .multilineTextAlignment(.center)
        .transition(.opacity)
    }
}

#Preview {
    InstructionsView()
}
