import SwiftUI

struct TrackerView: View {
    @EnvironmentObject var store: SleepStore
    @State private var now: Date = Date()
    @State private var ticker: Timer?

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 20) {
                    primaryCard
                    if !store.entries.isEmpty {
                        historyCard
                    }
                    Spacer(minLength: 20)
                }
                .padding(24)
            }
        }
        .navigationTitle("Track Sleep")
        .navigationBarTitleDisplayMode(.large)
        .toolbarBackground(Theme.bgTop, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .onAppear { startTicker() }
        .onDisappear { stopTicker() }
    }

    private var primaryCard: some View {
        Group {
            if let start = store.inProgressStart {
                inProgressView(start: start)
            } else {
                startButton
            }
        }
    }

    private var startButton: some View {
        Button { store.startSleeping() } label: {
            VStack(spacing: 10) {
                Image(systemName: "bed.double.fill")
                    .font(.system(size: 44))
                Text("Going to sleep")
                    .font(.title2.bold())
                Text("Tap when you're ready for bed")
                    .font(.footnote)
                    .opacity(0.8)
            }
            .foregroundColor(Theme.bgTop)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 36)
            .background(
                RoundedRectangle(cornerRadius: 28, style: .continuous)
                    .fill(Theme.accent)
            )
        }
        .buttonStyle(.plain)
    }

    private func inProgressView(start: Date) -> some View {
        VStack(spacing: 14) {
            Text("Sleeping since")
                .font(.headline)
                .foregroundColor(.white.opacity(0.7))
            Text(DateFormatter.shortTime.string(from: start))
                .font(.system(size: 56, weight: .bold))
                .foregroundColor(.white)

            Text(elapsedString(from: start))
                .font(.title3.monospacedDigit())
                .foregroundColor(Theme.accent)

            Button { store.stopSleeping() } label: {
                Text("I'm awake")
                    .font(.title3.bold())
                    .foregroundColor(Theme.bgTop)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Capsule().fill(Theme.accent))
            }
            .buttonStyle(.plain)
            .padding(.top, 8)

            Button("Cancel") { store.cancelInProgress() }
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.6))
        }
        .glassCard(padding: 28)
    }

    private var historyCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent nights")
                .font(.headline)
                .foregroundColor(.white.opacity(0.8))
            ForEach(Array(store.entries.reversed().prefix(10))) { entry in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(entry.dateString)
                            .font(.subheadline.weight(.semibold))
                            .foregroundColor(.white)
                        Text("\(entry.startString) – \(entry.endString)")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.6))
                    }
                    Spacer()
                    Text(entry.durationString)
                        .font(.title3.weight(.semibold))
                        .foregroundColor(Theme.accent)
                }
                .padding(.vertical, 8)
                if entry.id != store.entries.first?.id {
                    Divider().background(Color.white.opacity(0.08))
                }
            }
        }
        .glassCard()
    }

    private func elapsedString(from start: Date) -> String {
        let total = max(0, Int(now.timeIntervalSince(start)))
        let h = total / 3600
        let m = (total % 3600) / 60
        let s = total % 60
        return String(format: "%dh %02dm %02ds", h, m, s)
    }

    private func startTicker() {
        stopTicker()
        ticker = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            now = Date()
        }
    }

    private func stopTicker() {
        ticker?.invalidate()
        ticker = nil
    }
}
