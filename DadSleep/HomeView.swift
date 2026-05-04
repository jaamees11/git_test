import SwiftUI

struct HomeView: View {
    @EnvironmentObject var sleepStore: SleepStore
    @EnvironmentObject var alarmStore: AlarmStore

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.bg.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        header
                        if let last = sleepStore.lastEntry {
                            lastNightCard(last)
                        }
                        if !sleepStore.entries.isEmpty {
                            statsRow
                        }
                        actionGrid
                        scheduleFooter
                        Spacer(minLength: 24)
                    }
                    .padding(24)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
        }
        .tint(Theme.accent)
    }

    // MARK: - Header

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 10) {
                Image(systemName: "moon.stars.fill")
                    .foregroundColor(Theme.accent)
                    .font(.title2)
                    .accessibilityHidden(true)
                Text("DadSleep")
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.7))
                Spacer()
            }
            Text(greeting)
                .font(.largeTitle.bold())
                .foregroundColor(.white)
                .minimumScaleFactor(0.8)
                .lineLimit(1)
            Text("Rest well tonight.")
                .font(.title3)
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 16)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("DadSleep. \(greeting). Rest well tonight.")
    }

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12:  return "Good morning"
        case 12..<17: return "Good afternoon"
        case 17..<22: return "Good evening"
        default:      return "Good night"
        }
    }

    // MARK: - Last night

    private func lastNightCard(_ entry: SleepEntry) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Last night")
                .font(.subheadline.weight(.semibold))
                .foregroundColor(.white.opacity(0.7))
            Text(entry.durationString)
                .font(.system(size: 44, weight: .bold))
                .foregroundColor(.white)
                .minimumScaleFactor(0.6)
                .lineLimit(1)
            Text("\(entry.startString) – \(entry.endString)")
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.6))
        }
        .glassCard()
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Last night you slept \(entry.durationString), from \(entry.startString) to \(entry.endString).")
    }

    // MARK: - Stats

    private var statsRow: some View {
        HStack(spacing: 12) {
            StatTile(
                value: sleepStore.weeklyAverageString,
                label: "Avg this week",
                accessibilityValue: sleepStore.weeklyAverage == nil
                    ? "no data yet"
                    : "average sleep this week is \(sleepStore.weeklyAverageString)"
            )
            StatTile(
                value: "\(sleepStore.currentStreak)",
                label: sleepStore.currentStreak == 1 ? "Day streak" : "Days in a row",
                accessibilityValue: "\(sleepStore.currentStreak) day sleep tracking streak"
            )
        }
    }

    // MARK: - Action grid

    private var actionGrid: some View {
        LazyVGrid(
            columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)],
            spacing: 16
        ) {
            NavigationLink { SoundsView() } label: {
                ActionCard(title: "Sleep Sounds", icon: "moon.stars.fill")
            }
            .accessibilityLabel("Sleep Sounds. Open soothing background sounds.")

            NavigationLink { BreathingView() } label: {
                ActionCard(title: "Breathe", icon: "wind")
            }
            .accessibilityLabel("Breathe. Open guided breathing exercise.")

            NavigationLink { TrackerView() } label: {
                ActionCard(title: "Track Sleep", icon: "bed.double.fill")
            }
            .accessibilityLabel("Track Sleep. Log when you go to bed and wake up.")

            NavigationLink { AlarmView() } label: {
                ActionCard(title: "Wake Up", icon: "alarm.fill")
            }
            .accessibilityLabel("Wake Up. Set the daily alarm and bedtime reminder.")
        }
    }

    // MARK: - Schedule footer

    private var scheduleFooter: some View {
        VStack(alignment: .leading, spacing: 6) {
            scheduleLine(
                enabled: alarmStore.enabled,
                onIcon: "alarm.fill",
                offIcon: "alarm",
                onText: "Alarm: \(alarmStore.nextFireString)",
                offText: "No alarm set"
            )
            scheduleLine(
                enabled: alarmStore.bedtimeEnabled,
                onIcon: "moon.zzz.fill",
                offIcon: "moon.zzz",
                onText: "Bedtime reminder: \(alarmStore.nextBedtimeString)",
                offText: "No bedtime reminder set"
            )
        }
        .padding(.top, 4)
    }

    private func scheduleLine(enabled: Bool,
                              onIcon: String, offIcon: String,
                              onText: String, offText: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: enabled ? onIcon : offIcon)
                .foregroundColor(enabled ? Theme.accent : .white.opacity(0.4))
                .accessibilityHidden(true)
            Text(enabled ? onText : offText)
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.7))
            Spacer()
        }
        .accessibilityElement(children: .combine)
    }
}

private struct ActionCard: View {
    let title: String
    let icon: String

    var body: some View {
        VStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 38))
                .foregroundColor(Theme.accent)
                .accessibilityHidden(true)
            Text(title)
                .font(.headline)
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.7)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity, minHeight: 140)
        .padding(20)
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

private struct StatTile: View {
    let value: String
    let label: String
    let accessibilityValue: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(value)
                .font(.title.weight(.bold))
                .foregroundColor(.white)
                .minimumScaleFactor(0.7)
                .lineLimit(1)
            Text(label)
                .font(.footnote)
                .foregroundColor(.white.opacity(0.6))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Theme.card)
                .overlay(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .stroke(Theme.cardStroke, lineWidth: 1)
                )
        )
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibilityValue)
    }
}

#if DEBUG
#Preview {
    HomeView()
        .environmentObject(SleepStore())
        .environmentObject(AlarmStore())
        .environmentObject(NoiseEngine())
        .preferredColorScheme(.dark)
}
#endif
