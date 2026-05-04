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
