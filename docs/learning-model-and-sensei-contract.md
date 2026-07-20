# Learning model and Sensei behaviour contract

> **Status:** proposed product-logic specification, drafted 2026-07-20. It defines what the prototype remembers and how Sensei uses that information. It is independent of the eventual web or mobile implementation.

## 1. Design goals

The system must turn meaningful interactions into useful future learning without pretending to know more than it does. It should:

- adapt recommendations to evidence, not a fixed lesson sequence;
- preserve learner agency and make recommendations explainable;
- separate Japanese ability from game-like XP;
- retain the learner's context, not just isolated translations;
- make calibrated decisions under uncertainty;
- let any tutor character share the same learning quality.

## 2. Learner profile

Create a profile during setup. Every early field is editable and provisional.

| Field | Meaning | Source |
| --- | --- | --- |
| `displayName` | Optional friendly name | Learner, later |
| `supportLanguage` | Language for explanations and translations | Setup/settings |
| `immersionMode` | Native support, Japanese-first, immersion, or custom balance | Setup/settings |
| `selfReportedComfort` | Initial Japanese comfort hint | Setup |
| `correctionIntensity` | Just chat, gentle, or closely coached | Setup/session |
| `agentProfile` | Sensei preset or custom-character description | Settings |
| `goals` | Reasons for learning and intended contexts | Conversation/settings |
| `interests` | Themes that make content meaningful | Conversation/settings |
| `availableTime` | Optional daily effort preference | Settings |
| `furiganaMode` | None, all, learning items, or estimated-unknown kanji | Settings |
| `providerPreference` | Selected AI provider/model and capability state | Settings |

The profile contains no authoritative “level” field. A separate ability estimate is generated from evidence and always carries confidence.

## 3. Core learning entities

### Learning item

A learning item represents a usable unit of language, not merely a dictionary row. It may be a word, phrase, grammar pattern, kanji reading, or sentence pattern.

| Field | Description |
| --- | --- |
| `id` | Stable internal identifier |
| `kind` | Word, phrase, grammar pattern, kanji, or sentence pattern |
| `japanese` | Canonical Japanese form |
| `reading` | Kana reading when applicable |
| `meaning` | Meaning in the selected support language; may be revised later |
| `notes` | Concise usage and disambiguation notes |
| `examples` | One or more contextual examples |
| `tags` | Topics, grammar categories, source packs, or learner tags |
| `sourceContexts` | References to the interactions where it mattered |
| `learnerState` | Current evidence-based state, below |
| `review` | Timing and recall evidence, below |
| `createdAt` / `updatedAt` | Audit and ordering timestamps |

### Learner state for an item

Use a transparent, evidence-based state rather than a binary known/unknown label:

- **Seen** — introduced or viewed; no evidence of recall yet.
- **Recognised** — learner showed likely comprehension or selected the right meaning.
- **Practised** — learner attempted to use it in text/speech or a guided response.
- **Reliable** — repeated evidence of correct use/recall over time.
- **Needs review** — due for retrieval or recent evidence suggests instability.

The interface may show a friendly label but must never claim “mastered forever.” A learner may manually mark an item as not useful, hide it, or remove it.

### Source context

Every important item can retain why it mattered:

| Field | Description |
| --- | --- |
| `type` | Conversation, question, image, pasted text, story, review |
| `summary` | Short human-readable context, for example “first chat about food” |
| `reference` | Optional link to safely retained source data if supported |
| `createdAt` | When the context occurred |

An image-derived item should still be useful if the original image is unavailable. The item stores a text summary, not a dependency on the image.

### Interaction and learning evidence

Store interaction records separately from derived learning items. Each record has the user input, Sensei response, source type, relevant item IDs, and timestamp. A smaller evidence record captures an observed learning signal:

| Field | Examples |
| --- | --- |
| `itemId` | The item affected |
| `eventType` | introduced, viewed, recognised, attempted, correct-use, corrected-use, recall-success, recall-miss, skipped |
| `confidence` | 0–1 confidence in the interpretation |
| `context` | Conversation, story question, image selection, review |
| `timestamp` | When it occurred |
| `detail` | Optional concise explanation, such as the corrected particle |

The prototype should retain enough event detail to explain a recommendation. It should not infer success from time spent viewing a screen.

## 4. Ability estimate

Estimate skills independently: reading, listening, vocabulary recognition, grammar comprehension, written production, and spoken production where evidence exists. The prototype will have sparse listening/speech evidence, so those areas should say “not enough evidence” rather than guess.

For each skill, retain:

- estimated band: emerging, developing, comfortable, or strong;
- confidence: low, medium, or high;
- evidence summary: recent successful/unsuccessful interactions;
- suggested next capability to practise.

JLPT labels may be shown only as rough optional orientation after enough relevant evidence exists. They must not be inferred from XP.

## 5. Recommendation policy

Sensei chooses one recommended action, never a compulsory queue. Candidate actions include contextual review, short conversation, learner-led question, Discover practice, reading, or rest/consolidation.

### Candidate ranking

Prioritise, in order:

1. Items due for recall or recently unstable;
2. A frequently recurring error that has one clear next exercise;
3. A useful item arising from the learner's own goals, interests, or discoveries;
4. A balanced next skill based on sparse/uneven evidence;
5. A lightweight exploration option when no learning need is urgent.

Apply these guardrails:

- recommend only a short, realistically completable activity;
- avoid repeating the same exercise format too often;
- favour material the learner has voluntarily saved or encountered;
- do not introduce excessive new material when consolidation is due;
- always offer an explanation and alternatives.

### Initial prototype scheduling

For a newly saved item, suggest a brief contextual revisit in the next session. After successful recall, extend the interval; after an uncertain or incorrect recall, bring it back sooner in a different context. This rule is intentionally simple, visible in behaviour, and replaceable later without changing the learner-facing item model.

## 6. Focus and XP rules

### Focus

Focus represents a recommendation about new-material capacity, not an access gate.

- New/demanding items consume more Focus than review or ordinary chat.
- Successful spaced recall and sustainable sessions gradually improve capacity.
- Repeated overload or weak recall lowers the recommendation for new content.
- Low Focus changes the recommended activity toward recall, familiar conversation, or a break.
- A learner can continue; the interface clearly explains the trade-off.

Do not display an exact pseudo-scientific fatigue number unless it becomes understandable and useful in testing. A qualitative indicator plus a clear recommendation is preferable initially.

### XP

XP rewards purposeful learning events, such as a first genuine attempt, a successful recall, a correction applied in context, or an item intentionally saved and practised. It does not reward idle time, repeated button presses, or simply generating content. The exact values are an implementation-level tuning decision; the visible reason for an award is required.

## 7. Sensei’s invariant teaching behaviour

All agent characters obey these rules:

1. **Understand intent first.** Respond to what the learner was trying to say before correcting form.
2. **Adapt language.** Use Japanese and support-language help according to the current immersion mode and observed comfort.
3. **Correct proportionately.** Prioritise errors that block meaning, recur, or support today's goal. Avoid correcting every minor issue in normal conversation.
4. **Be explicit about alternatives.** Say whether a form is incorrect, less natural, more formal, or simply another valid option.
5. **Teach one useful thing at a time.** Default to a short explanation and one meaningful next action; expand when asked.
6. **Invite output, never demand it.** Offer a short reply, role-play, or recall prompt; allow skip, hint, and topic changes.
7. **Use evidence carefully.** Mark an item as practised only after relevant output or retrieval; do not equate exposure with knowledge.
8. **Respect uncertainty.** Do not invent image labels, translations, grammar rules, ability estimates, or source facts. State uncertainty and invite correction.
9. **Preserve agency.** Explain recommendations and do not imply a learner must follow one path to progress.
10. **Stay in character safely.** Character affects voice and style, never core pedagogical accuracy or learner controls.

## 8. Response construction

For an ordinary learner message, Sensei should internally determine: learner intent; language difficulty; whether correction is useful; target item(s); and the smallest next action.

The displayed response normally contains:

1. Acknowledgement or direct answer;
2. Japanese phrase/example where useful, formatted with the selected furigana mode;
3. One concise correction or explanation only if justified;
4. One optional next action;
5. Optional save candidates, limited to the most useful one or two.

Example, gentle correction:

```text
I understood you. In this situation, ラーメンを食べたいです sounds natural.
Here, を marks the thing you want to eat.
Want to use it in a sentence about yourself?
```

In “just chat,” defer a non-blocking correction. In “coach me closely,” give the correction and short reason, but keep the conversation moving.

## 9. AI output contract

The UI needs reliable structured information alongside display text. The provider adapter should request or derive a response with these conceptual fields:

| Field | Purpose |
| --- | --- |
| `displayReply` | Learner-facing response in the agent’s voice |
| `languageSegments` | Japanese forms, readings, meanings, and tappable boundaries |
| `corrections` | Optional correction type, original form, improved form, concise reason |
| `saveCandidates` | Bounded proposed learning items and source relevance |
| `practicePrompt` | Optional contextual output invitation |
| `evidence` | Proposed learning events with confidence; app validates before persisting |
| `recommendationHint` | Optional next-action rationale |
| `uncertainties` | Claims the agent wants presented as uncertain |

The application owns persistence, XP, Focus, and learner-state transitions. The model may propose them but cannot unilaterally write them.

## 10. Provider and safety boundaries

- Provider-specific prompting, credentials, image capability, speech capability, and rate limits live behind an adapter interface.
- A provider/model change must not delete learning items or interaction history.
- Before sending images or pasted material, clearly state what is shared with the selected provider.
- If an AI request fails, preserve the learner's draft and any locally prepared learning context.
- AI-generated stories and language examples must be labelled as generated, especially when a learner might mistake them for real news or quotations.

### Prototype provider configuration

The prototype stores learner data locally and has no sign-in or sync requirement.
Its Settings screen presents provider connection choices rather than claiming one
permanent default service:

1. **OpenAI-compatible API** — endpoint, model name, and token;
2. **Anthropic-compatible API** — endpoint, model name, and token where the
   provider supports that protocol;
3. **Custom endpoint** — endpoint, protocol choice, model name, and token.

The initial UI may prefill an intentionally invalid, clearly labelled example
such as `sk-FillYourOpenAITokenHere`; it is a setup hint, never a functioning
credential or a promise of free service. The learner must enter valid
credentials or a compatible endpoint before an AI request can succeed.

OpenClaw, Hermes Agent, and Claude Code switching tools are useful ways for a
learner to manage their own model access, but the browser app should not attempt
to control those local agents directly. If they expose a compatible endpoint,
the learner configures that endpoint through the connection form.

The first verified learning-language modes are English (`en-US`), Simplified
Chinese (`zh-CN`), and Japanese immersion. Japanese immersion offers a reading
variant appropriate to the learner: kana-only at early stages, or kanji with
furigana as they progress.

## 11. Decisions still open before implementation

1. The concrete provider/model used to test the demo path.
2. Whether image analysis is enabled when the selected model supports vision;
   it is intended for the first build but must not block the prototype if
   configuration or capability fails.
3. Whether the product name “Japanese Everyday” remains the working name.
