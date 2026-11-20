# Keychain Builder mobile performance gate

- Date: 2026-11-20
- No Android device is attached (`adb devices -l` is empty), and the iPhone 17
  iOS 26.5 simulator cannot start because this Xcode cannot start its simulator
  service on this macOS (details in [mobile-browser.md](./mobile-browser.md)).
- No drag/pinch FPS sampling was performed. There are no device model/browser,
  sample duration, FPS, or resource measurements to report. Desktop responsive
  emulation does not establish the ≥30 FPS requirement.

T087 remains **blocked/pending** until a recorded Android and iPhone can run
fixed-frame and die-cut drag/pinch tests with images at or below 2048 px.
