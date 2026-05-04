import SwiftUI

struct AlarmView: View {
    @EnvironmentObject var store: AlarmStore
    @State private var permissionDenied = false

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    Text("Set a daily wake-up time, and an optional bedtime reminder. Notifications will fire even if your phone is locked.")
                        .font(.callout)
                        .foregroundColor(.white.opacity(0.7))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.top, 8)

                    wakeUpSection
                    bedtimeSection

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

    // MARK: - Wake-up

    private var wakeUpSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            sectionHeader(icon: "alarm.fill", title: "Wake up")

            DatePicker("Wake-up time",
                       selection: $store.time,
                       displayedComponents: .hourAndMinute)
                .datePickerStyle(.wheel)
                .labelsHidden()
                .colorScheme(.dark)
                .frame(maxWidth: .infinity)
                .accessibilityLabel("Wake up time")

            Toggle(isOn: enabledBinding(
                getter: { store.enabled },
                setter: { store.enabled = $0 }
            )) {
                Text(store.enabled ? "Alarm on" : "Alarm off")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            .tint(Theme.accent)
            .accessibilityLabel(store.enabled ? "Alarm enabled" : "Alarm disabled")

            if store.enabled {
                Label(store.nextFireString, systemImage: "bell.fill")
                    .font(.subheadline)
                    .foregroundColor(Theme.accent)
            }
        }
        .glassCard()
    }

    // MARK: - Bedtime

    private var bedtimeSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            sectionHeader(icon: "moon.zzz.fill", title: "Bedtime reminder")

            DatePicker("Bedtime reminder",
                       selection: $store.bedtimeTime,
                       displayedComponents: .hourAndMinute)
                .datePickerStyle(.wheel)
                .labelsHidden()
                .colorScheme(.dark)
                .frame(maxWidth: .infinity)
                .accessibilityLabel("Bedtime reminder time")

            Toggle(isOn: enabledBinding(
                getter: { store.bedtimeEnabled },
                setter: { store.bedtimeEnabled = $0 }
            )) {
                Text(store.bedtimeEnabled ? "Reminder on" : "Reminder off")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            .tint(Theme.accent)
            .accessibilityLabel(store.bedtimeEnabled ? "Reminder enabled" : "Reminder disabled")

            if store.bedtimeEnabled {
                Label(store.nextBedtimeString, systemImage: "bell.fill")
                    .font(.subheadline)
                    .foregroundColor(Theme.accent)
            }
        }
        .glassCard()
    }

    // MARK: - Helpers

    private func sectionHeader(icon: String, title: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Theme.accent)
            Text(title)
                .font(.title3.weight(.semibold))
                .foregroundColor(.white)
        }
        .accessibilityAddTraits(.isHeader)
    }

    private func enabledBinding(getter: @escaping () -> Bool,
                                setter: @escaping (Bool) -> Void) -> Binding<Bool> {
        Binding(
            get: getter,
            set: { newValue in
                if newValue {
                    store.requestPermission { granted in
                        if granted {
                            setter(true)
                            permissionDenied = false
                        } else {
                            permissionDenied = true
                        }
                    }
                } else {
                    setter(false)
                }
            }
        )
    }

    private var permissionWarning: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(.yellow)
                .accessibilityHidden(true)
            Text("Notifications are disabled. Enable them in Settings → DadSleep so the alarm and reminder can reach you.")
                .font(.footnote)
                .foregroundColor(.white.opacity(0.85))
        }
        .glassCard()
        .accessibilityElement(children: .combine)
    }

    private var footerNote: some View {
        Text("Make sure your phone isn't on silent and the volume is up. Both reminders repeat every day at the chosen time.")
            .font(.footnote)
            .foregroundColor(.white.opacity(0.55))
            .multilineTextAlignment(.center)
            .padding(.horizontal, 8)
    }
}

#if DEBUG
#Preview {
    NavigationStack { AlarmView() }
        .environmentObject(AlarmStore())
        .preferredColorScheme(.dark)
}
#endif
