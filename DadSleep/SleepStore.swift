import Foundation
import Combine

struct SleepEntry: Codable, Identifiable {
    var id = UUID()
    var start: Date
    var end: Date

    var duration: TimeInterval { end.timeIntervalSince(start) }

    var durationString: String {
        let total = max(0, Int(duration))
        let h = total / 3600
        let m = (total % 3600) / 60
        return "\(h)h \(m)m"
    }

    var startString: String { DateFormatter.shortTime.string(from: start) }
    var endString: String { DateFormatter.shortTime.string(from: end) }
    var dateString: String { DateFormatter.dayMonth.string(from: start) }
}

extension DateFormatter {
    static let shortTime: DateFormatter = {
        let f = DateFormatter()
        f.timeStyle = .short
        f.dateStyle = .none
        return f
    }()

    static let dayMonth: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "EEE, MMM d"
        return f
    }()
}

final class SleepStore: ObservableObject {
    @Published private(set) var entries: [SleepEntry] = []
    @Published private(set) var inProgressStart: Date?

    private let entriesKey = "sleep.entries.v1"
    private let inProgressKey = "sleep.inProgress.v1"

    init() {
        load()
    }

    var lastEntry: SleepEntry? { entries.last }

    /// Average sleep duration across the most recent up-to-7 entries.
    var weeklyAverage: TimeInterval? {
        let recent = Array(entries.suffix(7))
        guard !recent.isEmpty else { return nil }
        let total = recent.reduce(0.0) { $0 + $1.duration }
        return total / Double(recent.count)
    }

    var weeklyAverageString: String {
        guard let avg = weeklyAverage else { return "—" }
        let total = Int(avg)
        return "\(total / 3600)h \((total % 3600) / 60)m"
    }

    /// Number of consecutive calendar days (counting back from today or the
    /// most recent entry) that have at least one logged sleep.
    var currentStreak: Int {
        guard !entries.isEmpty else { return 0 }
        let cal = Calendar.current
        let loggedDays: Set<Date> = Set(entries.map { cal.startOfDay(for: $0.start) })
        var streak = 0
        var day = cal.startOfDay(for: Date())
        // If today isn't logged yet, start counting from yesterday so the
        // streak doesn't reset just because he hasn't slept yet today.
        if !loggedDays.contains(day) {
            day = cal.date(byAdding: .day, value: -1, to: day) ?? day
        }
        while loggedDays.contains(day) {
            streak += 1
            guard let prev = cal.date(byAdding: .day, value: -1, to: day) else { break }
            day = prev
        }
        return streak
    }

    func startSleeping() {
        guard inProgressStart == nil else { return }
        inProgressStart = Date()
        UserDefaults.standard.set(inProgressStart, forKey: inProgressKey)
    }

    func stopSleeping() {
        guard let start = inProgressStart else { return }
        let entry = SleepEntry(start: start, end: Date())
        entries.append(entry)
        inProgressStart = nil
        UserDefaults.standard.removeObject(forKey: inProgressKey)
        persistEntries()
    }

    func cancelInProgress() {
        inProgressStart = nil
        UserDefaults.standard.removeObject(forKey: inProgressKey)
    }

    func delete(_ entry: SleepEntry) {
        entries.removeAll { $0.id == entry.id }
        persistEntries()
    }

    private func load() {
        if let data = UserDefaults.standard.data(forKey: entriesKey),
           let arr = try? JSONDecoder().decode([SleepEntry].self, from: data) {
            entries = arr.sorted { $0.start < $1.start }
        }
        if let date = UserDefaults.standard.object(forKey: inProgressKey) as? Date {
            inProgressStart = date
        }
    }

    private func persistEntries() {
        if let data = try? JSONEncoder().encode(entries) {
            UserDefaults.standard.set(data, forKey: entriesKey)
        }
    }
}
