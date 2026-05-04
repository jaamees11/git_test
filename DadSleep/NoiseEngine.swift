import AVFoundation
import Combine

final class NoiseEngine: ObservableObject {
    enum Sound: String, CaseIterable, Identifiable {
        case rain, ocean, white, brown

        var id: String { rawValue }

        var label: String {
            switch self {
            case .rain:  return "Rain"
            case .ocean: return "Ocean"
            case .white: return "White Noise"
            case .brown: return "Brown Noise"
            }
        }

        var icon: String {
            switch self {
            case .rain:  return "cloud.rain.fill"
            case .ocean: return "water.waves"
            case .white: return "waveform"
            case .brown: return "waveform.path.ecg"
            }
        }
    }

    @Published private(set) var playing: Sound?
    @Published var volume: Float = 0.6 {
        didSet { player.volume = volume }
    }
    @Published private(set) var fadeRemaining: TimeInterval = 0

    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private let format: AVAudioFormat
    private let bufferFrames: AVAudioFrameCount = 88_200 // ~2s at 44.1kHz

    private var fadeTimer: Timer?
    private var fadeStartVolume: Float = 0
    private var fadeStartDate: Date?
    private var fadeDuration: TimeInterval = 0

    private var brownState: Float = 0
    private var oceanPhase: Float = 0
    private var pinkB: [Float] = [0, 0, 0, 0, 0, 0, 0]

    init() {
        format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 1)!
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        configureSession()
    }

    private func configureSession() {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .default)
    }

    func toggle(_ sound: Sound) {
        if playing == sound {
            stop()
        } else {
            play(sound)
        }
    }

    func play(_ sound: Sound) {
        if playing != nil { stop() }
        playing = sound

        try? AVAudioSession.sharedInstance().setActive(true)
        if !engine.isRunning {
            try? engine.start()
        }
        player.volume = volume
        scheduleBuffer(for: sound)
        scheduleBuffer(for: sound)
        player.play()
    }

    func stop() {
        cancelFade()
        player.stop()
        player.reset()
        engine.stop()
        playing = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    func startFade(seconds: TimeInterval) {
        cancelFade()
        guard seconds > 0, playing != nil else { return }
        fadeStartVolume = volume
        fadeStartDate = Date()
        fadeDuration = seconds
        fadeRemaining = seconds
        fadeTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] timer in
            guard let self = self, let start = self.fadeStartDate else {
                timer.invalidate()
                return
            }
            let elapsed = Date().timeIntervalSince(start)
            let progress = min(1.0, elapsed / self.fadeDuration)
            let newVolume = self.fadeStartVolume * Float(1.0 - progress)
            self.player.volume = max(0, newVolume)
            self.fadeRemaining = max(0, self.fadeDuration - elapsed)
            if progress >= 1.0 {
                timer.invalidate()
                self.fadeTimer = nil
                self.stop()
            }
        }
    }

    func cancelFade() {
        fadeTimer?.invalidate()
        fadeTimer = nil
        fadeStartDate = nil
        fadeRemaining = 0
        if playing != nil { player.volume = volume }
    }

    // MARK: - Buffer scheduling

    private func scheduleBuffer(for sound: Sound) {
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: bufferFrames),
              let channel = buffer.floatChannelData?[0] else { return }
        buffer.frameLength = bufferFrames
        fillBuffer(channel: channel, count: Int(bufferFrames), sound: sound)
        player.scheduleBuffer(buffer, completionCallbackType: .dataPlayedBack) { [weak self] _ in
            guard let self = self, self.playing == sound else { return }
            self.scheduleBuffer(for: sound)
        }
    }

    private func fillBuffer(channel: UnsafeMutablePointer<Float>, count: Int, sound: Sound) {
        switch sound {
        case .white:
            for i in 0..<count {
                channel[i] = Float.random(in: -0.4...0.4)
            }

        case .brown:
            for i in 0..<count {
                let w = Float.random(in: -1...1)
                brownState = brownState * 0.996 + w * 0.04
                channel[i] = brownState * 1.6
            }

        case .rain:
            // Paul Kellet's pink noise approximation, slightly brightened to feel like rain
            for i in 0..<count {
                let w = Float.random(in: -1...1)
                pinkB[0] = 0.99886 * pinkB[0] + w * 0.0555179
                pinkB[1] = 0.99332 * pinkB[1] + w * 0.0750759
                pinkB[2] = 0.96900 * pinkB[2] + w * 0.1538520
                pinkB[3] = 0.86650 * pinkB[3] + w * 0.3104856
                pinkB[4] = 0.55000 * pinkB[4] + w * 0.5329522
                pinkB[5] = -0.7616 * pinkB[5] - w * 0.0168980
                let pink = pinkB[0] + pinkB[1] + pinkB[2] + pinkB[3]
                    + pinkB[4] + pinkB[5] + pinkB[6] + w * 0.5362
                pinkB[6] = w * 0.115926
                channel[i] = pink * 0.08
            }

        case .ocean:
            let sampleRate: Float = 44_100
            let lfoFreq: Float = 0.08 // ~12s wave period
            for i in 0..<count {
                let w = Float.random(in: -1...1)
                brownState = brownState * 0.996 + w * 0.04
                let lfo = (sin(oceanPhase) + 1) * 0.5
                oceanPhase += 2 * .pi * lfoFreq / sampleRate
                if oceanPhase > 2 * .pi { oceanPhase -= 2 * .pi }
                channel[i] = brownState * 1.6 * (0.25 + 0.75 * lfo)
            }
        }
    }
}
