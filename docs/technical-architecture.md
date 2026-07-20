# Prototype technical architecture

> **Status:** selected architecture for the first build, drafted 2026-07-21. The goal is a browser-first demonstration that deliberately preserves a credible path to iOS and Android.

## Decision summary

Build a **universal Expo application** with **TypeScript**, **React Native**, and **Expo Router**. Develop and demonstrate it first in the browser, using React Native for Web rather than a web-only DOM interface. This is the best fit for the product direction: fast web iteration now, with shared screens and device integrations available when we later target native mobile.

Expo supports web development and recommends React Native for Web when cross-platform reuse matters. Web-only DOM components remain possible only behind a platform-specific boundary. [Expo web documentation](https://docs.expo.dev/workflow/web/)

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Application framework | Expo SDK + React Native + TypeScript | One codebase can target web, iOS, and Android. |
| Navigation | Expo Router | File-based routes, tabs, modal sheets, and future deep links. |
| Web target | Expo Web / React Native for Web | Browser-first demo without giving up native portability. |
| Local database | Repository interface: Dexie/IndexedDB on web, `expo-sqlite` on native | Reliable browser persistence now and a structured native database later. |
| Small UI state | React context + `useReducer` | Keeps the initial app understandable; avoid a global-state library until evidence requires it. |
| Validation | Zod | Validate imported data, settings, and AI structured responses at the app boundary. |
| Styling | React Native `StyleSheet` + app-owned design tokens | Portable, accessible, and clear; no dependence on a web-only styling system. |
| Images | `expo-image-picker` | Shared image selection path for web and future native apps. |
| Testing | Vitest for domain logic; Selenium Grid for browser acceptance flows | Tests the learning rules, UI behaviour, and final web journeys separately. |

We will use current Expo-compatible versions selected by `npx expo install`, not manually pin arbitrary library versions.

## Why not a Vite-only React app?

A Vite React app would be perfectly valid for a web-only prototype, but this project explicitly values a mobile destination. Starting with Expo avoids rewriting every screen from HTML/CSS to native components later. It also gives us a natural path to image selection, camera, TTS, device speech input, haptics, and secure native credential storage when those features mature.

This does not mean we promise native apps in the prototype. The initial target remains a browser build.

## High-level shape

```text
Expo screens (Home, Sensei, Discover, Read, You)
                     │
          feature controllers / hooks
            │          │          │
     learning engine  repositories  AI provider adapter
            │          │          │
       pure rules   local SQLite   chosen endpoint
            │                       (browser request)
       recommendations,
       XP, Focus, item states
```

Screens never decide XP, mastery, or provider request formats directly. The learning engine owns deterministic product rules; provider adapters own provider-specific request/response details; repositories own persistence.

## Project organisation

```text
app/                         Expo Router routes and layout
  (onboarding)/
  (tabs)/                    Home, Sensei, Discover, Read, You
  settings/
  modal/
src/
  components/                Reusable portable UI components
  design/                    Tokens, typography, themes, icons
  features/                  Screen-specific controllers and views
  domain/                    Types and pure learning rules
  data/                      SQLite schema, migrations, repositories, import/export
  ai/                        Provider adapters, prompt/context construction, schemas
  services/                  Image input, speech capability checks, platform services
  i18n/                      App copy and support-language utilities
  test/                      Fixtures and test helpers
assets/                      Fonts and static visual assets
docs/                        Product and architecture decisions
```

`domain/` must not import React, Expo, SQLite, or a model SDK. That boundary is what keeps the learning system portable and testable.

## Local data and portability

### Storage choice

Use platform-specific repositories behind one interface: Dexie/IndexedDB in the browser and `expo-sqlite` on native builds. IndexedDB is designed for persistent structured browser data, while Expo SQLite remains the native path. [IndexedDB documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [Expo SQLite documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)

Initial tables:

- `profile` — learner preferences and provisional skill estimates;
- `learning_items` — saved words, phrases, grammar patterns, and state;
- `item_examples` — examples and learner attempts;
- `source_contexts` — why an item mattered;
- `learning_evidence` — observed learning events and confidence;
- `interactions` — concise conversation/AI history needed for continuity;
- `recommendations` — current suggested action and explanation;
- `settings` — provider metadata and non-secret configuration;
- `schema_meta` — database/export format version.

### Export and import

Export/import is a real prototype feature, not a future placeholder.

- Export produces a versioned JSON file containing learner data and settings that are safe to transfer.
- Secrets/tokens are excluded from every export by default.
- Import validates the file with Zod before any write.
- The user sees a preview: profile, item count, interaction count, conflicts, and database-version compatibility.
- Import supports **merge** (recommended) and **replace local data**. Replace requires an explicit confirmation and offers an export first.
- Schema migrations run on import when a safe migration exists; unsupported future versions are refused with a clear message.

Images are not required to be preserved in the first export format. Their text context remains with learning items, so exported learning remains useful without source images.

### Sign-in presentation

The Settings screen may display Apple, Google, and other sign-in options as disabled “Coming soon” controls. Selecting one opens a clear sheet: “Sync is not available in this prototype. Your learning is stored on this device; use Export to make a backup.” These controls must never imply that the user is signed in or that data is being synchronised.

## AI provider boundary

The app does not integrate OpenClaw, Hermes, or Claude Code in the prototype. It connects only to a configured HTTP API endpoint.

### Connection profiles

Support these configuration shapes:

| Profile | Required fields |
| --- | --- |
| OpenAI-compatible | Base endpoint, model ID, bearer token |
| Anthropic-compatible | Base endpoint, model ID, token, API version if required |
| Custom | Base endpoint, protocol type, model ID, token, optional headers |

The first displayed OpenAI token is an invalid example value: `sk-FillYourOpenAITokenHere`. It cannot be accidentally used as a credential.

Connection testing sends a small non-learning request and reports: reachable endpoint, authentication result, selected model, text capability, structured-output support, image/vision capability, and error text where safely available.

### Browser credential reality

Without a server, the selected provider token is used from the browser. The prototype must state that anyone with access to that browser profile may be able to access the stored token. On native platforms, use platform secure storage later; on web, do not describe browser storage as equivalent protection. Export excludes credentials.

The initial connection profile is stored separately from learner content and can be deleted independently. A future server relay may replace direct browser calls without changing the feature or domain interfaces.

Text and image analysis may use separate connection profiles. By default, image
analysis reuses the text connection; a learner can explicitly enable a different
image endpoint, model, and token when their text provider lacks vision support.

For providers that offer a JSON response mode, the adapter requests it for
Sensei, Discover, Read, and image candidates. The adapter still accepts clearly
labelled plain-text fields as a recovery path, so a provider's Markdown fences
or a minor format deviation does not make a useful answer disappear.

## Source-linked reading

The web prototype fetches the official NHK NEWS WEB RSS feed directly from the
learner's browser. It displays attribution and a link to the original headline,
then sends only the selected headline and summary to the configured text model
to create a clearly labelled original practice reading. A publisher is included
only when its browser response permits cross-origin access; blocked feeds are
skipped rather than routed through an undisclosed proxy or copied into the app.

Future media integrations to evaluate after the prototype include Microsoft Edge
TTS (no-key device/service speech) and Codex-auth image generation. Neither is
part of the current learning loop until its authentication and user-facing data
handling are verified.

### Adapter interface

```ts
interface AiProvider {
  testConnection(profile: ConnectionProfile): Promise<ProviderCapabilities>;
  reply(request: TutorRequest): Promise<TutorResponse>;
  analyseDiscovery(request: DiscoveryRequest): Promise<DiscoveryResponse>;
  generateStory(request: StoryRequest): Promise<StoryResponse>;
}
```

Each response is validated before the application persists learning evidence. The provider cannot directly write to the database, award XP, or mark an item as reliable.

## Discover and image analysis

Discover supports pasted Japanese text and image input. `expo-image-picker` works on web, iOS, and Android; on mobile web it must be initiated immediately by a user action. [Expo ImagePicker documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

For an image-capable configured model, the app sends a resized image plus an explicit instruction to identify only a small set of useful Japanese learning candidates. The learner confirms or corrects every item before saving. If vision is unavailable or the request fails, Discover still supports pasted text and shows a clear capability message; no other screen is blocked.

## Themes and design tokens

Start with one calm Japanese-inspired theme. Build a semantic token layer from the beginning:

```text
color.background, color.surface, color.text, color.mutedText,
color.primary, color.primaryPressed, color.success, color.warning, color.danger,
space.*, radius.*, typography.*, motion.*
```

Components consume semantic tokens, never hard-coded palette colours. This allows a later energetic theme to change mood without changing layout, component logic, or learning behaviour. Every theme must meet contrast and non-colour-only status requirements.

## Routing and screen state

Use Expo Router tabs for Home, Sensei, Discover, Read, and You. Use modal routes for word cards, save confirmation/detail, recommendation rationale, provider configuration, import preview, and unavailable-sync explanation.

Persisted state belongs in SQLite. Temporary state such as an unsent message, loading indicator, active image selection, and currently open sheet belongs in component/context state. Do not persist every UI detail.

## Testing plan

### Pure domain tests

Test item-state transitions, evidence confidence handling, recommendation ordering, Focus advice, XP eligibility, export migrations, and import conflict resolution without a UI or network.

### Component tests

Test onboarding choices, correction intensity, furigana rendering modes, save flows, disabled sync messaging, and error/retry states using mocked repositories and provider adapters.

### Browser end-to-end tests

Test the four acceptance scenarios using a deterministic fake provider. A real provider is used only for manual demonstration/quality checks, so API availability and cost never make automated tests flaky.

## Build sequence

1. Scaffold Expo/TypeScript project and quality tooling.
2. Implement design tokens, basic navigation, and onboarding with local SQLite profile persistence.
3. Implement the domain model, repositories, export/import, Library, and deterministic fake Sensei.
4. Implement Sensei text conversation, save flow, recommendations, XP, and Focus guidance.
5. Add provider configuration and OpenAI-compatible adapter; validate live text interaction.
6. Add Ask and generated Read.
7. Add Discover text, then real image analysis for a vision-capable connection.
8. Implement error handling, accessibility review, browser end-to-end tests, and a demonstration checklist.

No implementation begins until this architecture is reviewed. The first coding milestone is a navigable local prototype with a fake provider, not a fragile live-AI dependency.

## Deferred architecture

- User accounts, OAuth, cloud sync, backend database, server-side key management
- Subscription/billing and usage accounting
- Voice recording, pronunciation scoring, and full TTS pipeline
- Push notifications and background review scheduling
- Native builds and app-store distribution
- Direct integration with third-party agent harnesses
