# Build progress

> A concise record of completed implementation milestones. Product decisions
> remain in the other documents under `docs/`.

## M0 — Project foundation — complete (2026-07-21)

Implemented:

- Expo SDK, React Native, TypeScript, and Expo Router project foundation
- Browser-first universal route shell: Home, Sensei, Discover, Read, and You
- App-owned semantic design tokens for a calm default theme and future theme
  variants
- Mobile-responsive app shell and bottom navigation
- Initial static screens reflecting the agreed product structure
- Lint, type-check, and web-export scripts

Verified:

```text
npm run lint
npm run typecheck
__UNSAFE_EXPO_HOME_DIRECTORY=/tmp/japanese-everyday-expo-state \
  EXPO_NO_TELEMETRY=1 npm run web:export
```

The browser export contains the five application routes. No AI calls,
credentials, learner data, or sign-in behaviour have been implemented yet.

## Next: M1 — Local learner foundation

Implement SQLite migrations, learner onboarding/profile persistence, the
learning-item Library, and real versioned export/import with safe merge and
replace flows.

## M1 — Local learner foundation — complete (2026-07-21)

Implemented so far:

- Platform repository boundary: Dexie/IndexedDB for browser builds and the
  prepared Expo SQLite repository for future native builds
- Persistent three-choice onboarding profile
- Empty-state Library backed by real local repositories
- Versioned export bundle generation that excludes credentials
- Validated import with safe merge or explicit replace options

The browser export builds successfully with the IndexedDB adapter. Learning-item
creation begins with the Sensei learning loop in M2.

## M2 — Deterministic learning loop — complete (2026-07-21)

Implemented:

- Local deterministic Sensei responses that work without a provider key
- Phrase saving into the real local Library
- Home recommendations and Focus guidance based on saved learning items
- A visible, purposeful first-save XP reward
- Persistent learning-evidence events created with saved phrases
- Four automated domain tests covering tutor routing, XP, recommendation, and
  Focus advice

Verified with `npm run test`, type checking, linting, and a production browser
export.

## M3 — Live provider connection — in progress (2026-07-21)

Implemented:

- Persistent OpenAI-compatible endpoint, model, and token configuration
- Explicit connection test with endpoint/auth/CORS-oriented feedback
- Live Sensei request path with safe local-tutor fallback

The connection form intentionally begins with an invalid example token. A real
endpoint/key is needed to validate live output; structured response validation
and a phone/browser manual test follow before M3 is complete.

## M4 — Read and Discover text — complete (2026-07-21)

Implemented:

- Topic-selected mini-stories with Japanese, reading support, and a saveable phrase
- Learner-provided Japanese text discovery with a bounded learning candidate
- Shared Library persistence for language saved from either route
- Live text discovery using the configured text model
- Current NHK NEWS WEB headlines fetched in the browser and adapted into original, level-aware practice reading
- Library add, edit, and recoverable remove controls
- Connection-save confirmation and separate text/image connection checks

Verified with the domain test suite, type checking, linting, and production browser export.

## M5 — Image discovery and polish — in progress (2026-07-21)

Implemented:

- Cross-platform photo selection through Expo ImagePicker
- Explicit learner confirmation before a photo is sent to a provider
- Bounded, JSON-shaped image-learning candidate path and safe failure message

Provider validation: DeepSeek Flash accepts OpenAI-compatible text chat but
rejected image message parts, so it is not a usable vision provider. Xiaomi
MiMo V2.5 accepted the documented Base64 image request with HTTP 200 and is the
validated vision provider for the prototype. The adapter detects Xiaomi endpoints
and uses their required `api-key` header.

## Compatibility update — complete (2026-07-21)

The project now targets Expo SDK 54 (Expo 54.0.36, Expo Router 6.0.24, React
19.1.0, React Native 0.81.5), matching the current Expo Go version reported by
the iOS and Android test devices. Type checking and linting pass after the
alignment.
