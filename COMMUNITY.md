# I Ching Light Community — design and audit notes

This document records what the Community edition is, how it differs from the personal edition, and what has been verified. It is the technical companion to [README.md](README.md).

## Purpose of the fork

**I Ching Light Community** is the shareable, bring-your-own-key edition of I Ching Light. It preserves the validated Titan 2 Elite layout and the complete local oracle experience, but it does not call the owner-funded Manus AI routes. There is no shared key, no sponsored route, and no server-side AI in this edition: every AI request is made from the device to the provider whose key the user entered.

## What remains available without AI

Casting, changing lines, the complete Wilhelm material, Tao Te Ching passages, wisdom quotations, the reading archive, and cached readings work without an API key. Tap casting is the default. Settings can switch casting to shake-only on Android.

The three AI features are independent. Users can enable or disable the personalized interpretation, the one-bit Vision image, and the closing synthesis. The Vision card appears immediately before **Carrying Forward**, which gives the slower image request more time to finish while the user reads the preceding cards.

## Bring-your-own-key setup

Open **Settings** from the home screen, choose a provider, paste that provider's API key, and select **Save Key**. The **Test** action checks the provider's model-list endpoint and does not generate content. The app stores the key with Expo SecureStore on Android. Android backup is disabled for this app, and the key is not included in the reading archive or sent to an I Ching Light server.

The web preview deliberately keeps keys only in memory. A browser refresh clears them.

> A mobile device is not a hardware security module. Someone with a compromised or rooted device may still be able to extract secrets. Users should create a dedicated API key, set provider-side usage limits where available, and rotate or delete the key if the device is lost.

## Credit and cost isolation

The requirement for this fork is that downloading and using it must not consume the author's credits. That is verified structurally rather than by inspection alone:

- The fork makes no request to any owner-funded endpoint. The compiled Android bundle was searched for `forge.manus`, `manus-storage`, `api.manus.im`, the owner's open ID and name, the sandbox hostname, the project ID, and the account's database and JWT credentials. **None are present.**
- The only AI hosts in the compiled bundle are `api.openai.com`, `api.anthropic.com`, and `generativelanguage.googleapis.com`. Each request requires a key that the user entered on their own device.
- The app ships with no API key of any kind, and `api-key-store.ts` reads only what the user saved through Settings.
- Nothing in the fork is routed through Manus, so there is no path by which usage on a downloaded APK reaches the author's account.

The one owner-funded dependency that could not be fully removed is the app logo, which is served from a static file host referenced by `app.config.ts`. It is only a branding asset — never requested at runtime with credentials, and never billable. It can be pointed at any URL, or emptied to fall back to the bundled icon.

`__tests__/no-owner-funding.test.ts` enforces these guarantees over the source tree so a future edit cannot quietly reintroduce an owner-funded path.

## Supported providers

| Provider | Text model | One-bit image model | Practical positioning |
|---|---|---|---|
| OpenAI | `gpt-6-luna` | `gpt-image-2.5-flare` | Lowest published OpenAI text price in the current GPT-6 family; fast image generation is available. |
| Anthropic | `claude-haiku-4-5-20251001` | Not available | Text-only option. Vision is automatically disabled because Anthropic does not provide an image-generation model. |
| Google Gemini | `gemini-3.1-flash-lite` | `gemini-3.1-flash-lite-image` | Lowest-cost supported text option and the only documented text free tier among these defaults. |

### Model verification (checked 25 September 2026)

- OpenAI publishes `gpt-6-luna` as a current API model id, priced at $0.10 input / $0.50 output per 1M tokens.
- OpenAI's image API accepts the sizes `1024x1024`, `1024x1536`, `1536x1024`, and `auto`, and the qualities `low`, `medium`, `high`, `xhigh`, and `max`.
- Anthropic lists `claude-haiku-4-5-20251001` as the Claude Haiku 4.5 API id, at $1 input / $5 output per 1M tokens.
- Google publishes `gemini-3.1-flash-lite` (text) and `gemini-3.1-flash-lite-image` (image). Flash Lite Image supports `1:1` among its aspect ratios and a 1K (1024 px) `image_size`; 2K and 4K are not supported on the Lite image model.
- Google documents the `generationConfig.responseModalities: ["IMAGE"]` form for image-only `generateContent` responses.

## Current API cost comparison

Prices below were verified on **25 September 2026**. They are provider charges paid by the person whose key is entered. No AI charge is routed to the distributor of this APK.

| Provider | Text input | Text output | Generated image | Free-tier note |
|---|---:|---:|---:|---|
| OpenAI | $0.10 per 1M tokens for standard short-context input | $0.50 per 1M tokens for standard short-context output | Token-based: $8 per 1M image-input tokens and $30 per 1M image-output tokens; no exact per-image figure is published | No universal free API tier is documented. Some accounts may have promotional credits. |
| Anthropic | $1 per 1M tokens | $5 per 1M tokens | Not applicable | New API users receive a small, unspecified amount of test credits. |
| Google Gemini | Free tier: $0; paid tier: $0.25 per 1M tokens | Free tier: $0; paid tier: $1.50 per 1M tokens | $0.0336 for a documented 1K output image; image generation has no free tier | The Flash Lite text model has a documented free tier. |

OpenAI publishes long-context and caching rates separately. Anthropic also publishes prompt-caching and Batch API discounts. Google notes separate pricing for audio input and for alternative consumption modes. The app uses ordinary synchronous requests and does not use Batch APIs.

## Vision rendering performance

The Vision image is the slowest step, so the fork optimizes the parts it controls without changing what the model is asked to produce:

- **Earlier placement.** The Vision card sits immediately before **Carrying Forward**, so the request overlaps with the reading time of the preceding cards rather than blocking them.
- **On-device re-encode.** Provider images arrive at 1024 × 1024 (about 1M pixels) but are displayed in a card only a few hundred points wide. After download, the file is re-encoded once through `expo-image-manipulator`, capped at a 768 px longest edge while preserving the aspect ratio. This roughly halves the decoded pixel count and reduces the stored file size substantially.
- **Display-time caching.** The card uses `expo-image` with `cachePolicy="memory-disk"`, `priority="high"`, and a short fade, so revisiting a reading does not re-decode from scratch.
- **Never fatal.** If the optimizer is unavailable or fails, the original provider image is used. Measurement happens before resizing, so a small image is never upscaled.

The sizing policy (`lib/vision-optimize.ts`) is unit tested, including the guard against upscaling and the portrait/landscape cap logic.

## Validation completed

Baseline validation of the source archive was re-run inside this managed project after the owner-funded layer was removed:

| Check | Result |
|---|---|
| `pnpm check` (TypeScript) | Pass |
| `pnpm test` (Vitest) | 54 passed, 1 skipped |
| `pnpm lint` (Expo ESLint) | Pass |
| `npx -y expo-doctor` | 18/18 checks passed |
| `pnpm build` (server bundle) | Pass |
| `npx expo export --platform android --output-dir dist-android --clear` | Pass |
| Compiled-bundle audit for owner keys, endpoints, and identity | Clean |

Manual checks in the web preview confirmed the home screen, tap casting, the reading card stack, the Settings provider/key/toggle controls, the About screen, and the Archive with saved readings.

Direct provider authentication endpoints were checked with a deliberately invalid test value. OpenAI, Anthropic, and Gemini all returned their expected authentication errors, confirming that the configured endpoints are live without consuming generation tokens.

## References

[1]: https://developers.openai.com/api/docs/pricing "OpenAI API pricing"
[2]: https://openai.com/index/introducing-gpt-6-sol-and-luna/ "Introducing GPT-6 Sol and Luna"
[3]: https://developers.openai.com/api/docs/models/gpt-image-2.5-flare "GPT Image 2.5 Flare model"
[4]: https://help.openai.com/en/articles/8264644-what-is-prepaid-billing "OpenAI prepaid billing"
[5]: https://platform.claude.com/docs/en/about-claude/pricing "Claude API pricing"
[6]: https://platform.claude.com/docs/en/about-claude/models/overview "Claude models overview"
[7]: https://www.anthropic.com/claude/haiku "Claude Haiku"
[8]: https://ai.google.dev/gemini-api/docs/pricing "Gemini Developer API pricing"
[9]: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite "Gemini 3.1 Flash Lite"
[10]: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite-image "Gemini 3.1 Flash Lite Image"
[11]: https://ai.google.dev/gemini-api/docs/image-generation "Gemini image generation"
