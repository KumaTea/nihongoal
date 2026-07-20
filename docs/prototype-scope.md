# Prototype scope and acceptance criteria

> **Status:** proposed prototype baseline, drafted 2026-07-20.  This defines
> what we intend to demonstrate, not the full product roadmap.

## Prototype hypothesis

Learners will find an AI Japanese companion more valuable than a conventional
fixed lesson when it can turn a question or a real-life observation into a
short, level-appropriate interaction and remember the useful language for a
future session.

## Demonstrable learner promise

In one short session, a learner can choose how to begin, receive useful Japanese
help at an appropriate level, practise it with Sensei, and save a meaningful
item that changes a later recommendation.

## In scope

### 1. Onboarding and preferences

- Welcome screen and short, skippable setup
- Support language selection
- Self-reported Japanese comfort level
- Correction intensity: just chat, gentle corrections, or coach closely
- Furigana mode preference
- A user-editable basic profile

### 2. Home

- Clear primary entry: Talk with Sensei
- Equal-access quick actions: Ask a question, Discover, and Read
- Simple Journey XP display
- A small explanation of the current or next recommendation
- Persistent access to Sensei

### 3. Sensei conversation

- Text conversation as the reliable baseline
- Level- and preference-aware Japanese responses
- A natural first exchange based on learner goals/interests
- Targeted feedback matched to correction intensity
- One suggested next action per turn, not a mandatory lesson sequence
- Ability to save a useful word, phrase, or grammar pattern

### 4. Ask a question

- Text input for translation, phrasing, and grammar questions
- AI response with Japanese examples and the selected reading support
- Optional save of one or more useful learning items

### 5. Discover

- An entry point for an image or pasted text from the learner's life
- A small selection of useful Japanese labels/phrases from the source
- Learner control to select, correct, and save proposed items
- A route into Sensei practice using a selected discovery

### 6. Read

- Current headlines from browser-accessible official Japanese sources, with a link to the original
- One original AI-generated, level-matched practice reading based on a selected headline
- Tappable word help and the selected furigana display
- Ability to ask Sensei about a sentence and save a phrase

### 7. Learning library and adaptation

- A library of saved learning items
- Item details: Japanese, reading, meaning, source context, and status
- Basic states: seen, practised, and due for review
- A later Home recommendation that reflects saved items or recent interactions
- Manual review of a saved item
- Search across saved learning items, with a clear AI-lookup fallback

## Explicitly not part of this prototype

- Real-time pronunciation assessment
- A complete voice conversation experience
- Advanced spaced-repetition algorithms or a validated Focus formula
- Full object detection across arbitrary images
- Scraping or reproducing full publisher articles
- Full JLPT content packs and user dictionary import
- Social features, ranking systems, multiplayer, or a marketplace of agents
- Accounts, subscription billing, production-grade cross-device sync
- Native iOS/Android applications

## Behavioural requirements

### Learner freedom

No screen may require a learner to use Discover, Read, review, or a particular
study path before they can use another.  Recommendations must be understandable
and dismissible.

### Correctness and transparency

- Sensei should distinguish a correction from a stylistic alternative.
- It should say when it is uncertain about an image, text, or answer.
- It should not imply a precise proficiency level from sparse evidence.
- Any provider/model constraint that affects a feature must be communicated in
  the interface.

### Respectful feedback

- Default feedback is encouraging and brief.
- Error feedback focuses on learner intent and a usable improvement.
- The learner's selected correction intensity changes how often and how deeply
  Sensei corrects, not whether it remains accurate.

### Progress

- XP is tied to meaningful learning actions, not passive time in the app.
- Japanese ability remains a cautious multi-skill estimate, separate from XP.
- Focus/pacing guidance may recommend consolidation but must not lock a learner
  out of ordinary use.

## Acceptance scenarios

The prototype is ready for an initial demonstration when each scenario works
end-to-end with a coherent visible result.

### Scenario A: beginner conversation

1. A new learner selects English support, beginner comfort, and gentle
   corrections.
2. They open Sensei and say they like Japanese food.
3. Sensei teaches one useful phrase and invites a short response.
4. The learner saves the phrase.
5. Home later recommends a small food-related practise or review.

### Scenario B: learner-led question

1. A learner asks how to say “I want to eat ramen.”
2. Sensei explains a natural Japanese version at the learner's level.
3. The learner sees furigana in their selected mode and saves the phrase.
4. The saved item appears correctly in Library and can be reviewed.

### Scenario C: daily-life discovery

1. A learner brings an image or short text.
2. The app offers a limited set of useful Japanese learning candidates.
3. The learner selects one item and practises a sentence with Sensei.
4. The selected item, context, and learner attempt are available later.

### Scenario D: input-first learning

1. A learner opens Read.
2. They receive a short story tailored to their self-reported starting level.
3. They tap a word, ask a question, and save one phrase.
4. Sensei uses that phrase in a later conversation prompt.

## Demonstration measures

For a small set of trial users, observe and ask:

- Can they complete one learning loop without explanation?
- Can they explain why the app recommended a next action?
- Do they feel free to choose their own activity?
- Is Sensei's correction helpful at their chosen intensity?
- Would they return because the app remembered something meaningful?

The strongest success signal is not session length.  It is a learner voluntarily
returning to use, recognise, or review language that arose from their own life.

## Next design output

Convert this scope into a screen specification: navigation structure, each
screen's layout/content/state, and the exact transitions for the four acceptance
scenarios.
