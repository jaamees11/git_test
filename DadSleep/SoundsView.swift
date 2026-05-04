import SwiftUI

struct SoundsView: View {
    @EnvironmentObject var engine: NoiseEngine
    @State private var selectedFade: Int = 0

    private let fadeOptions = [0, 15, 30, 60, 120]

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 20) {
                    Text("Pick a sound to relax to. It will keep playing while your phone sleeps.")
                        .font(.callout)
                        .foregroundColor(.white.opacity(0.7))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.top, 8)

                    soundsGrid
                    volumeCard
                    fadeCard
                    Spacer(minLength: 20)
                }
                .padding(24)
            }
        }
        .navigationTitle("Sleep Sounds")
        .navigationBarTitleDisplayMode(.large)
        .toolbarBackground(Theme.bgTop, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    private var soundsGrid: some View {
        LazyVGrid(
            columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)],
            spacing: 16
        ) {
            ForEach(NoiseEngine.Sound.allCases) { sound in
                Button { engine.toggle(sound) } label: {
                    SoundTile(sound: sound, isPlaying: engine.playing == sound)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var volumeCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Volume")
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.8))
                Spacer()
                Text("\(Int(engine.volume * 100))%")
                    .font(.subheadline.monospacedDigit())
                    .foregroundColor(.white.opacity(0.6))
            }
            HStack(spacing: 12) {
                Image(systemName: "speaker.fill")
                    .foregroundColor(.white.opacity(0.5))
                Slider(value: Binding(
                    get: { Double(engine.volume) },
                    set: { engine.volume = Float($0) }
                ), in: 0...1)
                .tint(Theme.accent)
                Image(systemName: "speaker.wave.3.fill")
                    .foregroundColor(.white.opacity(0.5))
            }
        }
        .glassCard()
    }

    private var fadeCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Fade out after")
                .font(.headline)
                .foregroundColor(.white.opacity(0.8))
            HStack(spacing: 8) {
                ForEach(fadeOptions, id: \.self) { mins in
                    Button {
                        selectedFade = mins
                        if mins == 0 {
                            engine.cancelFade()
                        } else {
                            engine.startFade(seconds: TimeInterval(mins * 60))
                        }
                    } label: {
                        Text(mins == 0 ? "Off" : "\(mins)m")
                            .font(.subheadline.weight(.semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 40)
                            .background(
                                Capsule().fill(
                                    selectedFade == mins
                                        ? Theme.accent.opacity(0.4)
                                        : Color.white.opacity(0.08)
                                )
                            )
                            .overlay(
                                Capsule().stroke(
                                    selectedFade == mins ? Theme.accent : Color.clear,
                                    lineWidth: 1
                                )
                            )
                    }
                    .buttonStyle(.plain)
                }
            }
            if engine.fadeRemaining > 0 {
                Text("Fading out in \(formatRemaining(engine.fadeRemaining))…")
                    .font(.footnote)
                    .foregroundColor(Theme.accent)
                    .padding(.top, 4)
            }
        }
        .glassCard()
    }

    private func formatRemaining(_ seconds: TimeInterval) -> String {
        let total = Int(seconds.rounded())
        let m = total / 60
        let s = total % 60
        if m > 0 { return "\(m)m \(s)s" }
        return "\(s)s"
    }
}

private struct SoundTile: View {
    let sound: NoiseEngine.Sound
    let isPlaying: Bool

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: isPlaying ? "pause.circle.fill" : sound.icon)
                .font(.system(size: 42))
                .foregroundColor(isPlaying ? .white : Theme.accent)
            Text(sound.label)
                .font(.headline)
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity, minHeight: 150)
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(isPlaying ? Theme.accent.opacity(0.28) : Theme.card)
                .overlay(
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .stroke(isPlaying ? Theme.accent : Theme.cardStroke,
                                lineWidth: isPlaying ? 2 : 1)
                )
        )
    }
}
