# Build-ready implementation plan

> **Status:** proposed implementation plan, drafted 2026-07-21. This is the final planning artefact before project scaffolding and code begin.

## 1. Build outcome

The first demonstrable build lets a learner configure a compatible AI endpoint, complete light onboarding, talk to Sensei or ask a Japanese question, save language, see it in a Library, export/import their learning, and receive a simple later recommendation. Discover and Read then extend the same loop.

The build must remain useful when AI is unavailable: learner data, Library, export/import, navigation, and clear recovery states still work.

## 2. Route map

| Route group | Route | Screen | Primary responsibility |
| --- | --- | --- | --- |
| Onboarding | `/welcome` | Welcome | Product promise and start |
| Onboarding | `/setup/language` | Support language | Explain-language selection |
| Onboarding | `/setup/comfort` | Starting comfort | Provisional difficulty input |
| Onboarding | `/setup/feedback` | Feedback style | Correction preference |
| Tabs | `/(tabs)/home` | Home | Recommendation and activity launchers |
| Tabs | `/(tabs)/sensei` | Sensei | Conversation and practice |
| Tabs | `/(tabs)/discover` | Discover | Image/text source and candidates |
| Tabs | `/(tabs)/read` | Read | Story generation and reader |
| Tabs | `/(tabs)/you` | You | Personal overview |
| Nested | `/library` | Library | Search/filter saved items |
| Nested | `/library/[itemId]` | Item detail | Context and review launch |
| Nested | `/progress` | Your Japanese | Evidence-based ability view |
| Nested | `/settings` | Settings | Tutor, language, reading, AI, data |
| Modal | `/modal/word/[token]` | Word card | In-context language help |
| Modal | `/modal/why-this` | Recommendation rationale | Explain recommendation |
| Modal | `/modal/provider` | Provider connection | Configure/test endpoint |
| Modal | `/modal/import` | Import preview | Validate and merge/replace data |
| Modal | `/modal/sync-coming-soon` | Sync message | Honest disabled sign-in explanation |

The root layout resolves the learner profile. A missing profile routes to onboarding; an existing profile routes to Home. No authenticated route or server session exists.

## 3. Data schema

All primary IDs are UUID strings generated in the application. Timestamps are ISO-8601 UTC strings. Database migrations are append-only and each export carries `formatVersion`.

### `profile`

Single row keyed by `id = "local"`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text | Always `local` |
| `display_name` | text nullable | Optional |
| `support_language` | text | Initial: `en-US`, `zh-CN`, or `ja` |
| `immersion_mode` | text | Support, Japanese-first, immersion, custom |
| `starting_comfort` | text | Self-reported setup value |
| `correction_intensity` | text | Chat, gentle, coach |
| `furigana_mode` | text | None, all, learning, unknown |
| `agent_profile_json` | text | Preset ID plus optional custom description |
| `goals_json` | text | Learner goals |
| `interests_json` | text | Learner interests |
| `created_at` / `updated_at` | text | Audit |

### `learning_items`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text PK | UUID |
| `kind` | text | Word, phrase, grammar, kanji, sentence-pattern |
| `japanese` | text | Canonical display form |
| `reading` | text nullable | Kana reading |
| `meaning_json` | text | Meaning(s), keyed by support language where needed |
| `notes` | text nullable | Concise use/disambiguation note |
| `state` | text | Seen, recognised, practised, reliable, needs-review |
| `state_confidence` | real | 0–1 |
| `created_at` / `updated_at` | text | Audit |
| `archived_at` | text nullable | Soft removal from active learning |

Indexes: active state, updated time, Japanese form.

### `item_examples`

`id`, `item_id`, `japanese`, `reading`, `meaning`, `source`, `is_learner_attempt`, `created_at`.

### `source_contexts`

`id`, `type`, `summary`, `source_reference_json`, `created_at`.

`source_reference_json` may retain a safe local reference but must not require an original image to render the associated item.

### `item_contexts`

Join table: `item_id`, `context_id`.

### `learning_evidence`

`id`, `item_id`, `event_type`, `confidence`, `context_type`, `detail`, `occurred_at`.

`event_type` is one of introduced, viewed, recognised, attempted, correct-use, corrected-use, recall-success, recall-miss, or skipped. Evidence is append-only.

### `review_state`

`item_id`, `due_at`, `last_reviewed_at`, `successful_recalls`, `unsuccessful_recalls`, `last_outcome`.

### `interactions`

`id`, `kind`, `user_text`, `assistant_text`, `language_segments_json`, `corrections_json`, `created_at`.

Store concise, user-visible conversation history only. Never treat raw interaction history as a source of authority over the learner's edited Library data.

### `recommendations`

Single current record plus optional history: `id`, `action_type`, `item_ids_json`, `reason`, `created_at`, `dismissed_at`, `completed_at`.

### `settings`

Key/value metadata. Connection profiles exclude secrets when exported. The provider secret is stored separately through a platform credential store abstraction and is absent from normal screen state.

## 4. Domain modules and contracts

| Module | Inputs | Outputs | Must not do |
| --- | --- | --- | --- |
| `item-state` | Existing item + evidence | Updated state/confidence | Render UI or call AI |
| `review-scheduler` | Review state + recall outcome | Next due time | Award XP |
| `recommendation-engine` | Profile, items, evidence, review state | One recommendation + rationale | Enforce activity order |
| `focus-advisor` | Recent evidence and new-content load | Qualitative guidance | Block access |
| `xp-policy` | Confirmed learning event | Award/no award + reason | Estimate ability |
| `ability-estimator` | Evidence by skill | Band, confidence, explanation | Produce exact JLPT rank |
| `export-service` | Repositories | Versioned portable JSON | Include secrets |
| `import-service` | JSON + import mode | Validated migration/merge plan | Mutate before validation |

Domain functions are pure TypeScript whenever practical. Unit tests use fixtures and do not require Expo, SQLite, or an API key.

## 5. AI request lifecycle

### Shared request context

Every AI request receives only the minimum useful context:

- selected support language and immersion mode;
- correction intensity and agent-character style;
- learner comfort and cautious ability hints;
- current activity context and a small set of relevant items;
- specific task: converse, answer, discover, or generate a story.

Do not send the entire Library or full interaction history by default. Use a bounded recent conversation window plus a few relevant learning items.

### Response pipeline

```text
Learner action
  → feature controller prepares task
  → provider adapter formats HTTP request
  → provider response
  → schema validation
  → display reply and proposed learning signals
  → learner save/attempt/confirmation where needed
  → domain rules create evidence, state change, XP, and recommendation
  → repositories persist the outcome
```

Validation failure becomes a recoverable “Sensei could not prepare this response” error. No unvalidated response may create a learning item or evidence record.

### Required adapter methods

| Method | Success result | Error behaviour |
| --- | --- | --- |
| `testConnection` | Capabilities and safe model metadata | Preserve form; show endpoint/auth/capability issue |
| `reply` | Display reply, segments, correction, save candidates, practice prompt | Preserve draft and chat context |
| `answerQuestion` | Direct explanation plus candidates | Same as reply |
| `analyseDiscovery` | 1–5 uncertain candidates and one useful sentence | Fall back to text-only instruction |
| `generateStory` | Short generated story, segments, optional prompt | Offer Retry/topic change |

Provider adapters must respect abort/cancel signals, timeouts, and endpoint-specific CORS failures. The UI describes CORS as a provider/endpoint limitation, not a learner mistake.

## 6. Component map

### App-shell components

- `AppScreen` — safe areas, background, responsive width
- `PrimaryTabs` — five destination tabs
- `SenseiOrb` — global conversation entry
- `TopBar` — title and contextual actions
- `ModalSheet` — portable modal presentation
- `AsyncState` — loading/error/retry pattern

### Learning components

- `SenseiMessage`, `Composer`, `CorrectionCard`, `PracticePrompt`
- `JapaneseText` — furigana-aware text and tappable segments
- `WordCard`, `SaveItemButton`, `LearningItemRow`
- `RecommendationCard`, `FocusGuidance`, `XpToast`
- `DiscoverySourcePicker`, `DiscoveryCandidateList`
- `StoryReader`, `StoryTopicPicker`

### Settings/data components

- `ProviderProfileForm`, `ConnectionTestResult`
- `ImportPreview`, `ExportButton`, `ComingSoonSignInSheet`
- `FuriganaSelector`, `AgentSelector`, `LanguageModeSelector`

Components receive semantic design tokens and accessible labels. They do not embed provider endpoints, XP values, or Japanese-teaching policy.

## 7. Milestones and completion checks

### M0 — Project foundation

Create Expo app, TypeScript strict mode, lint/format scripts, unit-test setup, browser test setup, token system, and route shell.

**Done when:** browser build starts; five tabs render; tests and lint run; no feature requires an AI key.

### M1 — Local learner foundation

Implement SQLite migrations, profile onboarding, Preferences, Library schema/repositories, and real export/import.

**Done when:** onboarding survives refresh; an exported file excludes secrets; a valid export can merge into a clean browser profile; invalid imports make no changes.

### M2 — Deterministic learning loop

Implement fake provider fixtures, Sensei conversation UI, item saving, evidence recording, Library detail, recommendation engine, and XP/Focus presentation.

**Done when:** Scenario A and Scenario B from `prototype-scope.md` pass automatically with deterministic output.

### M3 — Live provider connection

Implement provider profile form, connection test, OpenAI-compatible text adapter, response validation, and robust network/CORS errors.

**Done when:** a user can enter a valid compatible endpoint/key, have one live Sensei conversation, save a phrase, and keep the phrase after a failed later request.

### M4 — Read and Discover text

Implement generated mini-story, word cards, context-aware Ask, and pasted-text discovery.

**Done when:** Scenario D and the text portion of Scenario C pass with live or deterministic provider output.

### M5 — Image discovery and polish

Implement image selection, capability detection, image analysis for supported models, candidate correction, accessibility review, and all browser end-to-end checks.

**Done when:** a vision-capable connection completes Scenario C; a non-vision connection gets a useful fallback; all four acceptance scenarios can be demonstrated.

## 8. Demonstration checklist

Before a demo, verify:

- Fresh-browser onboarding in English, Simplified Chinese, and Japanese immersion
- Local data survives reload
- API key form has no real key prefilled and export has no secret
- Disabled sign-in explains local-only prototype status
- Text chat works with fake provider; live provider failure is understandable
- Item save, review, XP reason, Focus recommendation, and Library context work
- Import preview and safe merge work
- Discover text works; image works or provides capability fallback
- Japanese text, furigana modes, navigation, focus order, and text contrast are usable on a narrow viewport

## 9. Implementation gate

Before scaffolding, confirm that this plan remains consistent with the product documents and that no unresolved choice changes the first milestone. The build will then start at M0 and report progress by milestone rather than by internal technical activity.
