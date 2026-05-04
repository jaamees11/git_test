# DadSleep

A simple, calming iOS sleep app — designed for an older user who wants
big buttons, big text, and not too many settings.

## What's inside

Four features on one home screen:

- **Sleep Sounds** — rain, ocean, white noise, brown noise. All sounds are
  generated procedurally at runtime, so the app ships with no audio files
  and no licensing concerns. Volume slider and fade-out timer
  (15 / 30 / 60 / 120 minutes). Audio keeps playing when the screen is
  locked.
- **Breathe** — animated 4-7-8 breathing exercise (inhale 4s, hold 7s,
  exhale 8s) with a softly pulsing circle. A well-known technique for
  falling asleep.
- **Track Sleep** — one giant "Going to sleep" button at bedtime,
  "I'm awake" in the morning. Saves a history of recent nights with
  duration. Stored locally in `UserDefaults`.
- **Wake Up** — daily repeating alarm via local notifications. Asks for
  notification permission the first time it's switched on.

The home screen also shows last night's sleep duration and the next
scheduled alarm at a glance.

## Tech

- **SwiftUI**, iOS 17+
- **AVAudioEngine** for procedural noise (Paul Kellet pink noise filter
  for rain, integrated brown noise for the ocean, etc.)
- **UserNotifications** for the alarm
- No third-party dependencies

## Building it

You'll need **a Mac with Xcode 15 or newer** (Xcode is free in the Mac
App Store). The first build of any iOS app also requires a free Apple
ID for on-device testing.

1. Clone this branch and open `DadSleep.xcodeproj` in Xcode.
2. Click the **DadSleep** target → **Signing & Capabilities** → pick your
   Team (your Apple ID will appear once you sign in to Xcode).
3. Change the bundle identifier from `com.example.DadSleep` to something
   unique like `com.yourname.DadSleep`.
4. Plug in an iPhone (or pick a simulator) and press ⌘R to run.

## Submitting to the App Store

1. You need a paid **Apple Developer Program** membership ($99/year).
2. Add an app icon: drop a 1024×1024 PNG into
   `DadSleep/Assets.xcassets/AppIcon.appiconset/` and reference it in
   `Contents.json`. Without an icon, App Store submission will fail.
3. In Xcode: **Product → Archive**, then upload to App Store Connect via
   the Organizer window.
4. In App Store Connect, create a new app, fill in screenshots and
   metadata, attach the build, and submit for review.

## Notes / known limitations

- iOS does not allow third-party apps to play alarms that override
  silent mode without a special "Critical Alerts" entitlement (which
  requires Apple's approval). A normal local notification works fine
  as long as the phone isn't muted and the volume is up.
- The procedurally generated sounds are CPU-cheap but not as polished
  as recorded samples. If you'd prefer high-fidelity rain/ocean
  recordings, drop `.caf` or `.m4a` files into the project and swap
  `NoiseEngine` for an `AVAudioPlayer`-based player.
- App icon is a placeholder. Add one before submitting to the App Store.
