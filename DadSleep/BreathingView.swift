import SwiftUI

struct BreathingView: View {
    @State private var phase: Phase = .ready
    @State private var cycleCount: Int = 0
    @State private var task: Task<Void, Never>?
    @State private var scale: CGFloat = 0.55

    enum Phase {
        case ready, inhale, hold, exhale

        var label: String {
            switch self {
            case .ready:  return "Ready when you are"
            case .inhale: return "Breathe in"
            case .hold:   return "Hold"
            case .exhale: return "Breathe out"
            }
        }

        var seconds: Double {
            switch self {
            case .ready:  return 0
            case .inhale: return 4
            case .hold:   return 7
            case .exhale: return 8
            }
        }
    }

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            VStack(spacing: 28) {
                Text("Slow, easy breathing helps you fall asleep. Follow the circle.")
                    .font(.callout)
                    .foregroundColor(.white.opacity(0.7))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 8)

                Spacer(minLength: 0)

                Text(phase.label)
                    .font(.title.weight(.semibold))
                    .foregroundColor(.white)
                    .frame(height: 40)

                breathingCircle
                    .frame(height: 320)

                Text(cycleCount > 0 ? "Cycle \(cycleCount)" : "Tap start to begin")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.6))

                Spacer(minLength: 0)

                Button {
                    if phase == .ready { start() } else { stop() }
                } label: {
                    Text(phase == .ready ? "Start" : "Stop")
                        .font(.title3.bold())
                        .foregroundColor(Theme.bgTop)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .background(Capsule().fill(Theme.accent))
                }
                .padding(.horizontal, 32)
                .padding(.bottom, 16)
            }
            .padding(24)
        }
        .navigationTitle("Breathe")
        .navigationBarTitleDisplayMode(.large)
        .toolbarBackground(Theme.bgTop, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .onDisappear { stop() }
    }

    private var breathingCircle: some View {
        ZStack {
            Circle()
                .stroke(Theme.accent.opacity(0.25), lineWidth: 1)
                .frame(width: 300, height: 300)

            Circle()
                .fill(
                    RadialGradient(
                        colors: [Theme.accent.opacity(0.7), Theme.accent.opacity(0.05)],
                        center: .center,
                        startRadius: 10,
                        endRadius: 180
                    )
                )
                .frame(width: 280, height: 280)
                .scaleEffect(scale)
                .animation(
                    .easeInOut(duration: phase.seconds > 0 ? phase.seconds : 0.4),
                    value: scale
                )
        }
    }

    private func start() {
        cycleCount = 1
        runCycle()
    }

    private func stop() {
        task?.cancel()
        task = nil
        phase = .ready
        cycleCount = 0
        withAnimation(.easeInOut(duration: 0.4)) { scale = 0.55 }
    }

    private func runCycle() {
        task?.cancel()
        task = Task { @MainActor in
            while !Task.isCancelled {
                phase = .inhale
                scale = 1.0
                try? await Task.sleep(nanoseconds: UInt64(Phase.inhale.seconds * 1_000_000_000))
                if Task.isCancelled { return }

                phase = .hold
                try? await Task.sleep(nanoseconds: UInt64(Phase.hold.seconds * 1_000_000_000))
                if Task.isCancelled { return }

                phase = .exhale
                scale = 0.55
                try? await Task.sleep(nanoseconds: UInt64(Phase.exhale.seconds * 1_000_000_000))
                if Task.isCancelled { return }

                cycleCount += 1
            }
        }
    }
}
