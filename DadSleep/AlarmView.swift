import SwiftUI

struct AlarmView: View {
    @EnvironmentObject var store: AlarmStore
    @State private var permissionDenied = false

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 20) {
                    Text("Set a daily wake-up time. The app will gently chime even if your phone is locked.")
                        .font(.callout)
                        .foregroundColor(.white.opacity(0.7))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.top, 8)

                    timeCard
                    toggleCard
                    if store.enabled {
                        nextWakeCard
                    }
                    if permissionDenied {
                        permissionWarning
                    }
                    footerNote
                    Spacer(minLength: 20)
                }
                .padding(24)
            }
        }
        .navigationTitle("Wake Up")
        .navigationBarTitleDisplayMode(.large)
        .toolbarBackground(Theme.bgTop, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    private var timeCard: some View {
        VStack(spacing: 8) {
            DatePicker("",
                       selection: $store.time,
                       displayedComponents: .hourAndMinute)
                .datePickerStyle(.wheel)
                .labelsHidden()
                .colorScheme(.dark)
                .frame(maxWidth: .infinity)
        }
        .glassCard(padding: 12)
    }

    private var toggleCard: some View {
        Toggle(isOn: Binding(
            get: { store.enabled },
            set: { newValue in
                if newValue {
                    store.requestPermission { granted in
                        if granted {
                            store.enabled = true
                            permissionDenied = false
                        } else {
                            permissionDenied = true
                        }
                    }
                } else {
                    store.enabled = false
                }
            }
        )) {
            HStack(spacing: 12) {
                Image(systemName: store.enabled ? "alarm.fill" : "alarm")
                    .font(.title3)
                    .foregroundColor(store.enabled ? Theme.accent : .white.opacity(0.5))
                Text(store.enabled ? "Alarm on" : "Alarm off")
                    .font(.headline)
                    .foregroundColor(.white)
            }
        }
        .tint(Theme.accent)
        .glassCard()
    }

    private var nextWakeCard: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Next wake-up")
                .font(.subheadline.weight(.semibold))
                .foregroundColor(.white.opacity(0.7))
            Text(store.nextFireString)
                .font(.title2.bold())
                .foregroundColor(.white)
        }
        .glassCard()
    }

    private var permissionWarning: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(.yellow)
            Text("Notifications are disabled. Enable them in Settings → DadSleep so the alarm can wake you.")
                .font(.footnote)
                .foregroundColor(.white.opacity(0.85))
        }
        .glassCard()
    }

    private var footerNote: some View {
        Text("Make sure your phone isn't on silent and the volume is up. The alarm repeats every day at this time until you turn it off.")
            .font(.footnote)
            .foregroundColor(.white.opacity(0.55))
            .multilineTextAlignment(.center)
            .padding(.horizontal, 8)
    }
}
