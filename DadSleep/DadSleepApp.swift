import SwiftUI

@main
struct DadSleepApp: App {
    @StateObject private var sleepStore = SleepStore()
    @StateObject private var alarmStore = AlarmStore()
    @StateObject private var noiseEngine = NoiseEngine()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(sleepStore)
                .environmentObject(alarmStore)
                .environmentObject(noiseEngine)
                .preferredColorScheme(.dark)
        }
    }
}
