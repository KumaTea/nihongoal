# First-session journey

> **Status:** design proposal, drafted 2026-07-20.  This is the next item for
> review before a screen specification or implementation begins.

## Purpose

The first session must demonstrate the product's promise in a few minutes:
**the app can turn a learner's real interest into appropriate Japanese practice,
then remember what matters.**

It should not demand a long placement exam, force one learning order, require a
photo, or make the learner configure an AI provider before they understand the
value.

## Success criteria for this journey

By the end of a first session, a learner should have:

1. had one useful Japanese interaction at a comfortable difficulty;
2. understood what Sensei will adapt to and why;
3. saved at least one meaningful word, phrase, or learning item;
4. seen an optional, believable next step for returning tomorrow;
5. retained control over tutor character, correction intensity, and support
   language.

The first prototype should test whether a learner can reach this outcome in
roughly 3–8 minutes without assistance.

## Principles governing the flow

- A learner can choose any activity at any time; onboarding only offers a
  helpful starting point.
- Sensei makes recommendations, not commands.
- The learner can postpone all nonessential questions and settings.
- The app asks for information only when it will improve the immediate
  interaction.
- Early uncertainty is shown honestly.  The app begins with a rough estimate,
  then learns from evidence.
- Every AI response has a purpose: converse, teach, check understanding, or
  decide what to retain.

## Journey map

```text
Welcome
  ↓
Light setup (support language, Japanese comfort, feedback preference)
  ↓
Home: “How would you like to begin?”
  ├── Talk with Sensei ──┐
  ├── Ask or type a question ─┤
  ├── Discover with image/text ─┤── Shared learning interaction
  ├── Read a short story ──────┤        ↓
  └── Quick review (if returning) ┘   Save / confirm learning item
                                         ↓
                                  Gentle next recommendation
                                         ↓
                                      Home / continue
```

All paths create evidence for the same learner model.  The model records what
was introduced, what the learner appeared to understand or use, what needs
review, and the context that made it meaningful.

## Screen 1: welcome

### Goal

Give a concise promise and establish that Sensei is an adaptive companion.

### Content

```text
Japanese for your real life

Talk, explore, read, and practise with an AI tutor that adapts to you.

[ Begin ]
Already learning? You can start anywhere.
```

Do not lead with account creation, a large feature tour, ranking, or technical
AI-provider setup.  If a provider is required to proceed, present it only after
the learner has opted in, in plain language, with a later “change provider”
path.

## Screen 2: light setup

The setup is one short, skippable sequence.  It has three questions, one per
screen or a compact progressive panel.  Every choice can be changed later.

### A. Support language

**Question:** “Which language should I use when Japanese needs explaining?”

- Searchable language selector, defaulting to the device language where
  appropriate.
- Option: “Japanese only / I want a challenge.”
- A note that available languages depend on the selected AI model.

### B. Starting comfort

**Question:** “How comfortable do you feel with Japanese today?”

- New to Japanese
- I know some basics
- I can hold simple conversations
- I am comfortable; challenge me
- Not sure — let Sensei find out

This is a starting hint, not an exam result or a permanent level.

### C. Feedback style

**Question:** “How should Sensei correct you?”

- Let me chat
- Gentle corrections (recommended)
- Coach me closely

Sensei then says, in the selected support language with a small amount of
Japanese appropriate to the stated comfort: “Nice to meet you.  We can change
this anytime.”

## Screen 3: first home

### Goal

Offer choice without paralysis, and make the best next action obvious.

### Proposed layout

```text
Good evening, [name]                         Journey Lv. 1 · 0 XP

Sensei is getting to know your Japanese.
Start anywhere—I will adapt as we go.

[ Talk with Sensei ]                         Primary action

Choose your own start
[ Ask a question ]  [ Discover ]  [ Read a mini-story ]

Your first small goal
Learn and use one useful phrase today.        [ Why this? ]
```

There is intentionally no daily task list yet.  The learner has no history, so
a fake schedule would be misleading.  The app can introduce the Focus concept
only after enough learning evidence exists to make it useful.

The navigation remains visible: Home, Sensei, Discover, Read, You.  The Sensei
orb is persistent and opens a text-first conversation; voice is offered if
supported.

## Entry route A: talk with Sensei

### Intent

This is the default suggested route because it works even if the learner has no
camera access, no material to import, and no idea where to start.

### First exchange

Sensei asks one open but easy question matched to the stated comfort:

> What made you want to learn Japanese? You can answer in [support language],
> Japanese, or a mix.

For a beginner, it may offer tappable response ideas.  For a confident learner,
it asks primarily in Japanese and adjusts after the first response.

### Example: beginner answer

Learner: “I like Japanese food.”

Sensei:

> Great starting point. In Japanese, you can say **日本料理が好きです**
> (*nihon ryōri ga suki desu*) — “I like Japanese food.”
>
> Would you like to try saying or typing it, or talk about a food you enjoy?

The learner may respond, skip, switch topic, or ask why が is used.  All are
valid interactions.  The app should not force a repetition exercise.

### Evidence captured

- stated goal/interest: Japanese food;
- initial text/voice language and Japanese output;
- whether the learner recognised, attempted, or used the phrase;
- correction preference and desired difficulty.

## Entry route B: ask a question

### Intent

Support an immediate need: translation, a phrase, grammar confusion, or “how
do I say this?”

### Interaction

The learner types, pastes, or speaks a question.  Sensei answers at the chosen
depth, with Japanese examples and furigana according to the reading setting.
It identifies at most one or two candidates worth retaining and asks:

> Save **〜が好きです** for a quick revisit later?

The learner can save, decline, or edit the item.  The answer itself should
remain useful even if nothing is saved.

## Entry route C: discover with image or text

### Intent

Connect learning to the learner's physical and digital environment, without
making camera use mandatory.

### Interaction

The learner can take/upload an image, paste text, or point the camera at text.
Before analysis, the app states what will be sent to the chosen AI provider and
asks for confirmation where platform rules require it.

Sensei presents a small, useful selection rather than labeling every possible
object.  For an image of a desk, it might show:

```text
Useful Japanese from this photo
ノート  notebook        ペン  pen        机  desk

Try: 机の上にノートがあります。
      There is a notebook on the desk.

[ Practise this ]  [ Save selected ]  [ Ask Sensei ]
```

The learner can correct an AI identification, remove an item, or choose a
different item.  Image recognition is treated as a suggestion, never as truth.

## Entry route D: read a mini-story

### Intent

Offer an approachable start for learners who prefer input before conversation.

### Interaction

Sensei generates a very short story based on stated interests and starting
comfort.  The learner can tap words, change furigana, ask about a sentence, and
choose one phrase to save.  A single optional comprehension or response prompt
creates output without turning reading into a test.

## Shared interaction: teaching and correction

Regardless of entry route, Sensei uses this response pattern:

1. Acknowledge the learner's intent.
2. Give the smallest helpful correction or explanation.
3. Offer one meaningful next action, never a pile of drills.
4. Mark learning evidence with calibrated confidence.

For example, after an incorrect particle, Sensei may say:

> I understood you. Here, **を** makes the action sound more natural:
> 「ラーメンを食べたいです」. Want to use that in a sentence about yourself?

In “just chat” mode, the correction is deferred unless it impedes the exchange
or the learner asks.  In “coach me closely” mode, it is more explicit but still
brief enough to preserve conversational flow.

## Shared interaction: saving a learning item

A learning item is more than a dictionary entry.  It can contain:

- Japanese form, reading, meaning, and part of speech/grammar pattern;
- source context (conversation, photo, text, or story);
- example sentence and a learner-created attempt where available;
- learner status: seen, recognised, practised, reliable, or needs review;
- review timing and confidence;
- optional image/source reference subject to the learner's data choices.

Sensei proposes a save when an item is likely useful, new, or repeatedly
incorrect.  The learner owns the final choice.  Automatic saving must be an
opt-in setting, not the default.

## First-session close and return invitation

Once there is a saved item or comparable evidence of learning, Sensei gives a
short truthful recap:

```text
Today you used:
日本料理が好きです — I like Japanese food.

Next time, I can help you use it in a restaurant conversation.
[ Continue talking ]  [ Finish for now ]
```

Finishing should feel complete, not like abandoning a streak.  The app may give
a small XP reward for productive effort and show that it came from a specific
action (for example, “first phrase practised”), not from time spent online.

## Returning learner home

After enough history exists, Home gains a compact AI recommendation, such as:

> You remembered 3 of 4 food phrases yesterday.  One short restaurant
> conversation will reinforce the last one.

The learner can take it, choose another activity, or see why it was suggested.
Focus may be shown as an understandable pacing indicator only when it provides
actionable guidance.  It should not dominate the home screen or force an order
of activities.

## Prototype boundaries

### Include if feasible

- Light setup and user-editable preferences
- Text Sensei conversation
- One or more simple entry routes, preferably Talk and Ask first
- AI-generated explanation and gentle correction
- Saving/editing learning items
- Basic adaptive recommendation based on saved items and interaction history
- Furigana preference in generated Japanese
- Visible but simple XP/first progress feedback

### Defer until the core loop is validated

- Robust real-time pronunciation scoring
- Full camera object recognition and image-library management
- External news search/recommendation
- Large preinstalled dictionary catalogue and advanced imports
- Complex RPG systems, rankings, social features, and achievements
- Full mobile-native implementation and cross-device synchronisation

## Questions to resolve next

1. Which entry routes belong in the very first clickable/buildable prototype:
   Talk + Ask only, or include a constrained Discover route?
2. Should the first session require a name, or use a friendly generic greeting?
3. What does XP reward exactly, and which actions must never receive XP?
4. What level of explanation should be visible by default: one sentence,
   expandable detail, or a learner-controlled preference?
5. How should the app handle an unavailable AI provider, insufficient credits,
   or an unsupported support language without losing the learner's work?
