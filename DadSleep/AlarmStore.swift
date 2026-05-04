import Foundation
import UserNotifications
import Combine

final class AlarmStore: ObservableObject {
    @Published var time: Date {
        didSet {
            UserDefaults.standard.set(time, forKey: timeKey)
            if enabled { schedule() }
        }
    }

    @Published var enabled: Bool {
        didSet {
            UserDefaults.standard.set(enabled, forKey: enabledKey)
            if enabled { schedule() } else { cancel() }
        }
    }

    private let timeKey = "alarm.time.v1"
    private let enabledKey = "alarm.enabled.v1"
    private let notifId = "dadsleep.alarm.daily"

    init() {
        let savedTime = UserDefaults.standard.object(forKey: timeKey) as? Date
        self.time = savedTime ?? AlarmStore.defaultTime
        self.enabled = UserDefaults.standard.bool(forKey: enabledKey)
    }

    private static var defaultTime: Date {
        var comps = DateComponents()
        comps.hour = 7
        comps.minute = 0
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

    private func schedule() {
        cancel()
        let content = UNMutableNotificationContent()
        content.title = "Good morning"
        content.body = "Time to wake up."
        content.sound = .default

        let comps = Calendar.current.dateComponents([.hour, .minute], from: time)
        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
        let request = UNNotificationRequest(identifier: notifId, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }

    private func cancel() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [notifId])
    }

    var nextFireString: String {
        let comps = Calendar.current.dateComponents([.hour, .minute], from: time)
        guard let next = Calendar.current.nextDate(after: Date(),
                                                   matching: comps,
                                                   matchingPolicy: .nextTime) else { return "" }
        let f = DateFormatter()
        f.dateFormat = "EEEE 'at' h:mm a"
        return f.string(from: next)
    }
}
