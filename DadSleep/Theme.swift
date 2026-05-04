import SwiftUI

enum Theme {
    static let bgTop = Color(red: 0.05, green: 0.07, blue: 0.18)
    static let bgBottom = Color(red: 0.10, green: 0.12, blue: 0.32)
    static let accent = Color(red: 0.65, green: 0.75, blue: 1.0)
    static let card = Color.white.opacity(0.08)
    static let cardStroke = Color.white.opacity(0.14)

    static let bg = LinearGradient(
        colors: [bgTop, bgBottom],
        startPoint: .top,
        endPoint: .bottom
    )
}

struct GlassCard: ViewModifier {
    var padding: CGFloat = 20

    func body(content: Content) -> some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Theme.card)
                    .overlay(
                        RoundedRectangle(cornerRadius: 24, style: .continuous)
                            .stroke(Theme.cardStroke, lineWidth: 1)
                    )
            )
    }
}

extension View {
    func glassCard(padding: CGFloat = 20) -> some View {
        modifier(GlassCard(padding: padding))
    }
}
