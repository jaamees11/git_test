import Foundation
import UserNotifications
import Combine

final class AlarmStore: ObservableObject {
    // MARK: - Wake-up alarm

    @Published var time: Date {
        didSet {
            UserDefaults.standard.set(time, forKey: timeKey)
            if enabled { scheduleAlarm() }
        }
    }

    @Published var enabled: Bool {
        didSet {
            UserDefaults.standard.set(enabled, forKey: enabledKey)
            if enabled { scheduleAlarm() } else { cancelAlarm() }
        }
    }

    // MARK: - Bedtime reminder

    @Published var bedtimeTime: Date {
        didSet {
            UserDefaults.standard.set(bedtimeTime, forKey: bedtimeTimeKey)
            if bedtimeEnabled { scheduleBedtime() }
        }
    }

    @Published var bedtimeEnabled: Bool {
        didSet {
            UserDefaults.standard.set(bedtimeEnabled, forKey: bedtimeEnabledKey)
            if bedtimeEnabled { scheduleBedtime() } else { cancelBedtime() }
        }
    }

    // MARK: - Storage keys

    private let timeKey = "alarm.time.v1"
    private let enabledKey = "alarm.enabled.v1"
    private let bedtimeTimeKey = "alarm.bedtimeTime.v1"
    private let bedtimeEnabledKey = "alarm.bedtimeEnabled.v1"

    private let alarmId = "dadsleep.alarm.daily"
    private let bedtimeId = "dadsleep.bedtime.daily"

    init() {
        let savedAlarm = UserDefaults.standard.object(forKey: timeKey) as? Date
        self.time = savedAlarm ?? AlarmStore.defaultTime(hour: 7, minute: 0)
        self.enabled = UserDefaults.standard.bool(forKey: enabledKey)

        let savedBedtime = UserDefaults.standard.object(forKey: bedtimeTimeKey) as? Date
        self.bedtimeTime = savedBedtime ?? AlarmStore.defaultTime(hour: 22, minute: 0)
        self.bedtimeEnabled = UserDefaults.standard.bool(forKey: bedtimeEnabledKey)
    }

    private static func defaultTime(hour: Int, minute: Int) -> Date {
        var comps = DateComponents()
        comps.hour = hour
        comps.minute = minute
        return Calendar.current.date(from: comps) ?? Date()
    }

    /// Requests notification permission. Calls completion on the main queue
    /// with `true` only if permission was granted.
    func requestPermission(completion: @escaping (Bool) -> Void) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, _ in
            DispatchQueue.main.async {
                completion(granted)
            }
        }
    }

    // MARK: - Scheduling

    private func scheduleAlarm() {
        cancelAlarm()
        let content = UNMutableNotificationContent()
        content.title = "Good morning"
        content.body = "Time to wake up."
        content.sound = .default

        let comps = Calendar.current.dateComponents([.hour, .minute], from: time)
        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
        let request = UNNotificationRequest(identifier: alarmId, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }

    private func cancelAlarm() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [alarmId])
    }

    private func scheduleBedtime() {
        cancelBedtime()
        let content = UNMutableNotificationContent()
        content.title = "Time to wind down"
        content.body = "Open DadSleep to start your bedtime routine."
        content.sound = .default

        let comps = Calendar.current.dateComponents([.hour, .minute], from: bedtimeTime)
        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
        let request = UNNotificationRequest(identifier: bedtimeId, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }

    private func cancelBedtime() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [bedtimeId])
    }

    // MARK: - Display helpers

    var nextFireString: String { nextFireString(for: time) }
    var nextBedtimeString: String { nextFireString(for: bedtimeTime) }

    private func nextFireString(for date: Date) -> String {
        let comps = Calendar.current.dateComponents([.hour, .minute], from: date)
        guard let next = Calendar.current.nextDate(after: Date(),
                                                   matching: comps,
                                                   matchingPolicy: .nextTime) else { return "" }
        let f = DateFormatter()
        f.dateFormat = "EEEE 'at' h:mm a"
        return f.string(from: next)
    }
}
