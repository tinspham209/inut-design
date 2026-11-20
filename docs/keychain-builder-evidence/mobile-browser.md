# Keychain Builder mobile browser device gate

- Date: 2026-11-20
- Android: `adb devices -l` returned no attached devices. `agent-device open
  com.android.chrome --platform android --foreground` failed with
  `DEVICE_NOT_FOUND`; Android Chrome flow was not run.
- iOS: the iPhone 17 / iOS 26.5 simulator was listed, but Safari could not
  start because the installed Xcode cannot start its simulator service on this
  macOS. `agent-device snapshot -i --platform ios --device "iPhone 17"`
  reported that macOS refuses to load DTServiceHub and recommended selecting a
  compatible Xcode (`xcode-select -s /Applications/Xcode.app`) or updating
  Xcode. Installed tools report Xcode 26.6 at
  `/Applications/Xcode.app/Contents/Developer`.
- The desktop Chrome responsive emulation is recorded separately in
  [browser-viewports.md](./browser-viewports.md); it is not a substitute for
  either device flow.

T086 remains **blocked/pending** until Android Chrome and iOS Safari can be
launched on recorded devices and CORS-safe 3x export, image negotiation,
reduced motion and overflow checks are run there.
