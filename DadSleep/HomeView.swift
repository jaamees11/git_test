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
                        actionGrid
                        alarmFooter
                        Spacer(minLength: 24)
                    }
                    .padding(24)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
        }
        .tint(Theme.accent)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 10) {
                Image(systemName: "moon.stars.fill")
                    .foregroundColor(Theme.accent)
                    .font(.title2)
                Text("DadSleep")
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.7))
                Spacer()
            }
            Text(greeting)
                .font(.system(size: 36, weight: .bold))
                .foregroundColor(.white)
            Text("Rest well tonight.")
                .font(.title3)
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 16)
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

    private func lastNightCard(_ entry: SleepEntry) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Last night")
                .font(.subheadline.weight(.semibold))
                .foregroundColor(.white.opacity(0.7))
            Text(entry.durationString)
                .font(.system(size: 44, weight: .bold))
                .foregroundColor(.white)
            Text("\(entry.startString) – \(entry.endString)")
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.6))
        }
        .glassCard()
    }

    private var actionGrid: some View {
        LazyVGrid(
            columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)],
            spacing: 16
        ) {
            NavigationLink { SoundsView() } label: {
                ActionCard(title: "Sleep Sounds", icon: "moon.stars.fill")
            }
            NavigationLink { BreathingView() } label: {
                ActionCard(title: "Breathe", icon: "wind")
            }
            NavigationLink { TrackerView() } label: {
                ActionCard(title: "Track Sleep", icon: "bed.double.fill")
            }
            NavigationLink { AlarmView() } label: {
                ActionCard(title: "Wake Up", icon: "alarm.fill")
            }
        }
    }

    private var alarmFooter: some View {
        HStack(spacing: 10) {
            Image(systemName: alarmStore.enabled ? "alarm.fill" : "alarm")
                .foregroundColor(alarmStore.enabled ? Theme.accent : .white.opacity(0.4))
            Text(alarmStore.enabled
                 ? "Alarm: \(alarmStore.nextFireString)"
                 : "No alarm set")
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.7))
            Spacer()
        }
        .padding(.top, 4)
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
            Text(title)
                .font(.headline)
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
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
