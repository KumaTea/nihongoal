# Product principles and current decisions

> **Status:** living document, drafted 2026-07-20.  It records current
> agreements, not irreversible requirements.  We will revise it as the product
> becomes clearer.

## 1. Product intent

Create an AI-native Japanese learning companion that fits into everyday life.
The app should help learners notice, understand, practise, and remember useful
Japanese in contexts that matter to them.  It is not intended to be a
traditional vocabulary-first app with a chat feature added later.

### Core learning loop

1. A learner encounters something meaningful in daily life: an object, image,
   text, article, situation, or question.
2. The AI turns it into level-appropriate Japanese learning material.
3. The learner uses the language in conversation, writing, or (where supported)
   speech.
4. The app gives useful, proportionate feedback.
5. Valuable language returns later in adaptive review and new contexts.

Example: a learner photographs objects in their kitchen.  The app identifies
useful items, teaches the Japanese words and relevant expressions, and later
uses those same items in a small conversation or review.

## 2. Audience and adaptation

The app is for a broad range of learners rather than a narrow proficiency
group.  It should adapt to each person instead of presenting one fixed course.

The learner model should gradually account for:

- demonstrated vocabulary, kanji, grammar, comprehension, and production;
- recurring errors in text and speech;
- goals, interests, and preferred contexts;
- discoveries and material the learner brings into the app;
- review history, retention, available time, and feedback preference.

Initial onboarding should be light.  The system may offer an optional placement
check, but it should learn continuously from real interactions rather than
claiming certainty from one test.

## 3. AI tutor ("Sensei")

The default agent is **Sensei**: a warm, perceptive Japanese tutor.

- It is friendly and encouraging without being patronizing.
- It begins natural exchanges rather than sounding like a textbook.
- It prioritises corrections that block meaning, match today's learning goal,
  or recur frequently.
- It explains briefly by default and expands on request.
- It encourages active output: speaking and writing, not just recognition.
- It bases daily suggestions on the learner model and explains why a suggestion
  matters.

### Character versus teaching quality

The pedagogical engine must remain reliable while the learner chooses a
character/personality.  Characters may change tone, energy, interests, and
conversation style; they should not silently weaken feedback quality, learner
tracking, or safety boundaries.

Initial character choices may include:

- Sensei — balanced, supportive tutor (default)
- Conversation Partner — natural chat with fewer interruptions
- Strict Coach — detailed corrections and challenges
- Study Buddy — casual, high-energy encouragement
- Story Guide — scenario and role-play based learning
- Custom Agent — learner-provided description, interpreted within the common
  teaching engine

Correction intensity must be controllable per learner and, ideally, per
session: **just chat**, **gentle corrections**, or **coach me closely**.

## 4. Learning-language modes

The learner can select any support/base language the chosen AI model handles.
This is a learning mode, not merely a translated interface.

- **Native-language support:** explanations and translations use the selected
  support language.
- **Japanese-first:** conversation is Japanese; help appears in the support
  language when useful.
- **Japanese immersion:** explanations use simple Japanese and known words,
  with optional emergency translation.
- **Custom balance:** learners can choose different languages for conversation,
  grammar explanations, and word glosses.

The app may recommend an appropriate mode, but learners can override it easily
for an individual session.

## 5. Experience and information architecture

The interface should feel like an everyday companion, not a dense course
dashboard.  The AI agent is the centre of the experience, with an always
available distinctive **Sensei orb** for text or voice interaction.

Proposed top-level areas:

| Area | Purpose |
| --- | --- |
| Home | A small AI-guided plan for today, progress, and one clear next action. |
| Sensei | Text/voice Japanese conversation, role-play, corrections, and guided practice. |
| Discover | Camera/image and text exploration; quick questions; saving real-life discoveries. |
| Read | Current source-linked headlines and original level-matched practice readings. |
| You | Skills, history, saved language, dictionaries, display preferences, and AI settings. |

Home should suggest rather than impose a rigid checklist.  It may offer:

- a primary "Talk with Sensei" action;
- a short explanation of today's recommended focus;
- quick actions such as Camera, Ask a question, and five-minute review;
- a continuation of a recent real-life discovery.

## 6. Progress and motivation

Use two distinct signals:

- **Japanese ability profile:** a cautious estimate of usable language ability,
  potentially expressed with JLPT-aligned ranges and separate skills.  It
  changes slowly and should be transparent about uncertainty.
- **Journey level / XP:** a game-like progress system that rewards productive,
  sustainable activity and can change frequently.

Gamification should reinforce learning and consistency, never pressure learners
to optimise empty streaks or misleading rank.

### Learner agency and adaptive study capacity

There is no compulsory order of activities.  A learner may start a conversation,
review saved language, read a story, inspect a photo, import a list, or ask a
spontaneous question.  The AI should make a recommended next action clear, but
it must not make daily-life capture—or any other single activity—a prerequisite
for progress.

The game-like system should include an adaptive **study capacity** (the working
name is *Focus* rather than *fatigue*).  Its purpose is to protect long-term
retention: unlimited rapid introduction of new material makes learners forget
what they met first.

- Focus is primarily spent on new or demanding material; light review and
  ordinary chat should remain available.
- As Focus gets low, Sensei recommends consolidation, familiar-language
  conversation, or stopping for the day instead of simply blocking the user.
- The system should limit or reduce rewards for excessive new material, not
  punish curiosity or remove access to the app.
- Focus capacity adapts gradually: strong retention, completed review, and
  sustainable use can expand it; poor retention, skipped consolidation, or
  overloaded sessions can reduce it.
- The UI must clearly say what caused the recommendation and give the learner
  control to continue.  Any override should be intentional and should make the
  likely trade-off clear.

The exact name, visual metaphor, calculation, and thresholds remain to be
validated with users.  The product goal is healthy pacing and spaced practice,
not artificial scarcity.

## 7. Reading support and dictionaries

Furigana/ruby is a global accessibility and learning control.  Initial modes:

1. No furigana
2. Furigana on all kanji
3. Furigana only on current learning items
4. Furigana only on kanji the learner is estimated not to know

Any word should remain tappable for an on-demand reading, meaning, and
breakdown.

The app should support structured curriculum/dictionary packs (including
JLPT-oriented content) plus user imports, beginning with CSV.  Learners can
combine packs and exclude lower-level material if desired.  A reference list is
not the same as an active study list: importing a large list must not cause all
of it to appear in the daily plan.  Preinstalled content must have verified
licensing and provenance.

### Universal lookup

The app needs a basic, always-available lookup function for words and phrases.
It searches the learner's saved language and enabled dictionary packs locally
first, presenting reading, meaning, usage, and relevant context immediately.
When no reliable local result exists, it offers **Ask Sensei** for an
AI-generated explanation. AI lookup results are clearly identified as generated
and can be saved deliberately; they are not silently treated as verified
dictionary data.

## 8. Content strategy

Read recommends and links to original material with reading assistance, then
creates a clearly labelled AI practice reading. It must respect source licensing,
paywalls, freshness, and attribution rather than reproducing articles.

## 9. Platform and AI-provider direction

The first build is a browser prototype, chosen for iteration speed.  It is not
a commitment to an offline-first or privacy-first product.

Design the domain model and AI-provider interface to be portable, allowing a
future iOS/Android application without reinventing the learning system.  AI
providers/models must be replaceable.  A default low-cost or free option may be
offered, while learners can select another compatible model and supply valid
credentials where required.  Provider availability, quality, costs, and data
handling must be presented clearly instead of implied.

Voice should use the chosen provider/model's capabilities where available, with
graceful fallbacks such as device speech-to-text and text-to-speech.

## 10. Decisions still open

- Product name and visual identity
- First prototype's exact scope and success metrics
- Whether accounts/sync are needed in the prototype
- AI provider choices, credential flow, cost limits, and supported regions
- Camera/image recognition implementation and error handling
- Speech assessment quality and provider strategy
- Content sources and licensing for all preinstalled materials
- Data storage, export, retention, and privacy policies
- Accessibility and minimum supported devices/browsers

## 11. Product decision rule

When trade-offs arise, prefer the option that helps a learner use Japanese in a
real context, preserves clear learner control, and can be validated in a small
prototype before being scaled.
