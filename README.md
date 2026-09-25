# I Ching Light Community

A bring-your-own-key I Ching oracle for Android, built with Expo and React Native. It is designed for the **Unihertz Titan 2 Elite** near-square (1080 × 1200) display and also runs on phones, tablets, and the web.

This is the shareable, public edition. It keeps the complete local oracle experience and adds **optional** AI cards that use *your* API key with *your* provider. The app ships with no keys and calls no I Ching Light server.

---

## What you get without any API key

Everything that makes a reading work is local and free:

- Casting with **tap anywhere** or **shake** (tap is the default)
- Changing lines, the transformed hexagram, and the "where this leads" section
- The complete traditional Wilhelm material: Judgment, Image, symbolic description, and all six line texts
- Tao Te Ching passages and matched wisdom quotations
- The reading archive, plus cached readings you can revisit offline
- The **About** screen explaining the binary logic and probability behind the system

> An API key is only needed for the three optional AI cards. Casting a full reading without one works end to end.

---

## Bring your own key

Open **Settings** from the home screen, pick a provider, paste that provider's key, and select **Save Key**.

| Provider | Text model | One-bit image model | Notes |
|---|---|---|---|
| **OpenAI** | `gpt-6-luna` | `gpt-image-2.5-flare` | Lowest-cost current GPT text model; image generation available |
| **Anthropic** | `claude-haiku-4-5-20251001` | Not available | Text-only; the Vision toggle disables itself |
| **Google Gemini** | `gemini-3.1-flash-lite` | `gemini-3.1-flash-lite-image` | Low-cost text and the fastest current image model |

The **Test** action checks the provider's model-list endpoint. It does not generate content and does not consume generation tokens.

### How your key is handled

- On **Android**, the key is stored with `expo-secure-store` (Android Keystore-backed encrypted storage).
- **Android backup is disabled** for this app (`allowBackup: false`), so the key is not carried into cloud backups.
- On the **web preview**, the key is kept in memory only and clears on refresh.
- The key is **never** included in the reading archive, never written to the APK, and never sent anywhere except the provider you selected.

> A phone is not a hardware security module. Someone with a rooted or compromised device may still be able to extract secrets. Create a dedicated API key, set provider-side usage limits where available, and rotate or delete the key if the device is lost.

### Cost

You pay your provider directly. Neither this repository nor the person who built it receives any part of that charge, and there is no shared or sponsored AI route in the app. Published prices are collected in [COMMUNITY.md](COMMUNITY.md).

---

## The three optional AI cards

Each is an independent switch in **Settings**, so you can run just the one you want:

1. **Personalized interpretation** — a warm, grounded reading that connects the hexagram to your question.
2. **One-bit Vision** — a single MacPaint-style black-and-white image. This is usually the slowest and most expensive step, so the Vision card sits **immediately before Carrying Forward**, giving the request more time to finish while you read the earlier cards.
3. **Closing synthesis** — a short reflection that weaves the hexagram, the Tao passage, and your question together.

---

## Install (Android APK)

Download the APK from the [Releases page](https://github.com/knowmium/iching-light-community/releases), allow installation from that source, and open it. The Android package is `com.app.ichinglightcommunity` — distinct from the author's personal edition, so both can be installed side by side.

The APK is signed with a 2048-bit RSA release key. Verify a download with:

```bash
apksigner verify --print-certs iching-light-community-release.apk
```

## Build the APK yourself (no Expo account needed)

EAS Build is Expo's paid cloud service and requires an authenticated Expo account and an `EXPO_TOKEN`. **It is optional.** The release APK for this project is built entirely locally:

```bash
ANDROID_HOME=/path/to/android-sdk ./scripts/build-apk-local.sh
```

That script runs `expo prebuild` to generate the native project, creates a local signing key, and compiles with Gradle. Nothing contacts EAS, and no Expo token is required. You need a full JDK with `javac` (OpenJDK 17 is what Android's toolchain targets — a JRE alone is not sufficient) and an Android SDK containing platform-tools, a platform, build-tools, an NDK, and cmake.

> Downloading a finished APK never generates any Expo charge. This app has no over-the-air update mechanism (`expo-updates` is not installed), so there is no billing path tied to installs or usage. The only costs a user can incur are the ones they deliberately create with their own AI provider key.

---

## Run it yourself

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev          # Expo web preview + local API server
pnpm android      # Build and run on a connected device
```

Useful checks:

```bash
pnpm check        # TypeScript
pnpm test         # Unit tests
pnpm lint         # Expo ESLint
npx -y expo-doctor
pnpm build
npx expo export --platform android --output-dir dist-android --clear
```

---

## Project layout

```
app/                     Screens (expo-router, stack navigation)
  (tabs)/                Home screen route
  divination.tsx         Tap-or-shake casting
  reading.tsx            Reading orchestration and AI scheduling
  archive.tsx            Saved readings
  settings.tsx           Provider, key, casting mode, AI toggles
  about.tsx              How the system works
components/
  reading-cards.tsx      Swipeable card stack (the reading itself)
  hexagram-lines.tsx     Line rendering
lib/
  byok-ai.ts             Provider requests for text and images
  api-key-store.ts       Secure key storage
  community-settings.ts  Settings model and provider defaults
  iching.ts              Hexagram math and casting
  vision-optimize.ts     Vision image sizing policy
data/                    Wilhelm text, Tao Te Ching, wisdom quotes
__tests__/  lib/*.test.ts  components/*.test.ts   Unit tests
```

---

## Privacy

The app has no account system, no analytics, and no backend of its own. Your questions, readings, and images stay on your device. The only network requests are the ones you explicitly trigger against the provider you configured.

---

## License and attribution

The I Ching translation is the public-domain Wilhelm/Baynes material; Tao Te Ching passages use a public-domain translation. Wisdom quotations are attributed to their authors in the app.
