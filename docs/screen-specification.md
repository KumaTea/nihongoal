# Prototype screen specification

> **Status:** proposed interaction specification, drafted 2026-07-20. This defines behaviour before visual design or implementation.

## Global structure

Use five primary destinations: **Home**, **Sensei**, **Discover**, **Read**, and **You**. On mobile they appear in a bottom bar; on wider screens they use a compact rail or header. A distinctive Sensei orb is always available and opens conversation without forcing a study path.

Japanese words are tappable everywhere. A word card provides reading, meaning, breakdown, example, and Save when appropriate. Furigana follows the global preference. AI-generated content carries a subtle Sensei marker.

| State | Behaviour |
| --- | --- |
| Loading | Preserve context; show a concise progress message; disable only the action in progress. |
| Provider unavailable | Explain the missing capability; preserve draft input; offer Retry or Settings. |
| AI response failed | Do not fabricate a response; offer Retry or Edit and resend. |
| Empty content | Explain what will appear and offer optional entry routes. |
| Low confidence | Present output as a suggestion and let the learner correct it. |

## Welcome and setup

### W0 — Welcome

**Purpose:** communicate the product promise before asking for information.

```text
Japanese for your real life
Talk, explore, read, and practise with an AI tutor that adapts to you.
[ Begin ]
```

Begin opens setup. No name, account, placement test, or provider configuration is required.

### W1 — Support language

**Purpose:** select the language Sensei uses to explain Japanese.

```text
How should Sensei explain Japanese?
[ Search languages                         ]
□ Japanese only — I want a challenge
[ Continue ]
```

The choice is editable later. The selected provider’s language support is checked when configured.

### W2 — Starting comfort

**Purpose:** establish a provisional difficulty hint.

- New to Japanese
- I know some basics
- I can hold simple conversations
- I am comfortable; challenge me
- Not sure — let Sensei find out

This is never presented as a final level.

### W3 — Feedback style

**Purpose:** give correction control from the first interaction.

```text
How should Sensei correct you?
[ Just chat ]           Few interruptions
[ Gentle corrections ]  Recommended
[ Coach me closely ]    More detailed feedback
[ Start learning ]
```

Start creates an initial profile and opens H0.

## Home

### H0 — New learner Home

**Purpose:** give a clear recommendation while preserving choice.

```text
Good evening                         Journey Lv. 1 · 0 XP
Sensei is getting to know your Japanese. Start anywhere—I will adapt as we go.
[                 Talk with Sensei                 ]
Choose your own start
[ Ask a question ] [ Discover ] [ Read a mini-story ]
Your first small goal: Learn and use one useful phrase today. [ Why this? ]
```

Talk opens S0; Ask opens Q0; Discover opens D0; Read opens R0. “Why this?” opens a short, dismissible explanation.

### H1 — Returning learner Home

**Purpose:** surface adaptation visibly but not as a command.

```text
Suggested by Sensei
You nearly mastered 〜が好きです. Use it in a short food conversation.
[ Practise with Sensei ]                  [ Why this? ]
Quick actions: [ Ask ] [ Discover ] [ Read ] [ Review 3 items ]
```

Why this identifies evidence such as “practised once yesterday; due for a short retrieval attempt.” Low Focus may recommend consolidation but never disables another activity.

## Sensei

### S0 — New conversation

**Purpose:** establish a natural, level-sensitive first interaction.

```text
Sensei                                    [ feedback: Gentle v ]
こんにちは。Nice to meet you.
What made you want to learn Japanese? You can answer in English, Japanese, or a mix.
[ Type a message...                              ] [ Send ]
```

For beginners, offer optional chips such as Anime, Travel, Food, and Work. They never replace free input.

### S1 — Teaching moment

**Purpose:** maintain conversational flow while offering a usable improvement.

```text
You: I like Japanese food.
Sensei: Great starting point. You can say:
日本料理が好きです
にほんりょうり が すき です
I like Japanese food.
Would you like to try it, or tell me a food you enjoy?
[ Save phrase ] [ Why が? ]
[ Type a message...                              ] [ Send ]
```

Save creates a learning item and shows a non-blocking confirmation. “Why が?” expands a support-language explanation in the thread. The feedback selector changes future replies during the session and can update the global preference.

### S2 — Practice prompt

**Purpose:** invite active recall without a pass/fail quiz.

Sensei gives one contextual prompt, for example: “At a ramen shop, tell me what you want to eat.” The learner may answer, skip, ask for a hint, or change activities. Feedback follows the selected correction intensity.

### S3 — Session recap

**Purpose:** make learning evidence and return value visible.

```text
Today you used: 日本料理が好きです — I like Japanese food.
Next time, we can use it in a restaurant conversation.
[ Continue talking ] [ Finish for now ]
```

Finish returns to H1 without loss-framed streak language.

## Ask

### Q0 — Question composer

**Purpose:** answer immediate translation, phrasing, and grammar needs.

```text
Ask Sensei anything about Japanese
[ How do I say “I want to eat ramen”?             ] [ Send ]
Try: Translate a phrase · Check my sentence · Explain grammar
```

The learner can type or paste Japanese text. Send opens Q1.

### Q1 — Answer

**Purpose:** give a direct answer, then invite an optional learning action.

```text
ラーメンを食べたいです。
らーめん を たべたい です。
I want to eat ramen.
This is a polite, natural way to say it.
[ Save phrase ] [ Practise with Sensei ] [ Ask a follow-up ]
```

The response distinguishes natural phrasing from literal translation where helpful. Practise opens S2 with this phrase as context; follow-up opens a chat thread.

## Discover

### D0 — Source selection

**Purpose:** offer daily-life learning without assuming camera access.

```text
Discover Japanese around you
[ Take / choose a photo ]
[ Paste or type Japanese text ]
Sensei will suggest useful language—not a giant list.
```

Before analysis, show what source content is sent to the chosen provider. Cancel safely returns to Home.

### D1 — Suggestions from source

**Purpose:** make source-derived learning controllable.

```text
Useful Japanese from this photo
[✓] ノート    notebook
[✓] ペン      pen
[ ] 机        desk
Try: 机の上にノートがあります。 There is a notebook on the desk.
[ Save selected ] [ Practise this ] [ This is inaccurate ]
```

Show one to five candidates. The learner may remove or correct suggestions. Save adds selected items to Library; Practise opens S2 with this context.

## Read

### R0 — Story starter

**Purpose:** offer input-first learning.

```text
Read with Sensei
Today's short story can be about: [ Food ] [ Travel ] [ Daily life ] [ Surprise me ]
[ Generate a short story ]
```

Topic selection is optional. Sensei uses stated interests and active learning needs where available.

### R1 — Reader

**Purpose:** keep reading prominent while offering in-context help.

```text
Title
Japanese story text with configured furigana
[ tap a word for help ]
What did the character want to eat?
[ Answer Sensei ] [ Save a phrase ]
```

Word taps open a card. Answer Sensei begins a short exchange. Save opens a small selector; no items are saved automatically.

## You: Library, progress, and settings

### U0 — You overview

```text
You
Journey Lv. 4 · 160 XP
[ Library ]        12 saved items
[ Your Japanese ]  A developing estimate
[ Settings ]
```

### U1 — Library and item detail

**Purpose:** display saved language in personal context, not just a word list.

```text
Your Library                         [ Search ] [ Filter ]
Due for a quick revisit: 日本料理が好きです [ Review ]
Recently saved: 机 — desk; ノート — notebook
```

Item detail includes Japanese, reading, meaning, source, status, and example. Review opens S2. Learners may edit or remove items.

The Library header includes a search field. It searches saved items first; a
no-result state offers “Ask Sensei about this” rather than implying that an AI
answer is a preinstalled dictionary definition.

### U2 — Your Japanese

Show separate developing skills (useful phrases, reading, grammar in conversation) and their evidence. Use “early estimate” until enough evidence exists; do not show an authoritative JLPT rank in the prototype.

### U3 — Settings

Settings include Tutor (character/custom description/correction), Language (support language and immersion balance), Reading (furigana), AI (provider/model, credentials, status, data notice), Learning (goals/recommendations/Focus), and Data (saved-learning management/export when supported).

## Required transitions

| From | Action | To | Result |
| --- | --- | --- | --- |
| Home | Talk | S0/S1 | Conversation uses existing learner context. |
| Home | Ask | Q0 | Empty question composer opens. |
| Home | Discover | D0 | Source choices appear. |
| Home | Read | R0 | Story setup appears. |
| S1/Q1/D1/R1 | Save | Library data | Item is created/updated with non-blocking confirmation. |
| Q1/D1/R1 | Practise | S2 | Contextual practice begins. |
| Any screen | Sensei orb | S0/S1 | Current activity context is offered to Sensei. |
| S3 | Finish | H1 | Home recommendation reflects the session. |
| Library | Review | S2 | Contextual recall activity begins. |

## Visual direction

- Mobile-first and spacious, with one clear primary action per screen.
- Simple, restrained, and contemporary with a Japanese sensibility; avoid
  cliché motifs or decorative overload.
- Warm and calm; neither an enterprise chatbot nor a loud arcade game.
- The default theme favours calm focus. Design tokens should make an optional,
  more energetic theme possible later without duplicating layouts or learning
  behaviour.
- Japanese is prominent and highly legible; explanations are visually secondary.
- Progress feedback is restrained and tied to meaningful actions.
- Meet baseline accessibility needs: contrast, readable type, touch targets, keyboard navigation, and non-colour-only status cues.

### Palette policy

When visual design begins, choose a small functional palette rather than using
many colours merely because they are available. The palette should include a
neutral paper-like background, dark readable text, one calm primary/action
colour, and distinct accessible success/warning/error states. Traditional
Japanese colours may inform the choices; [Nippon Colors](https://nipponcolors.com/)
is an approved reference for researching them. Every final colour combination
must still be checked for contrast and semantic clarity, not chosen only for
its cultural name or appearance.

## Review checkpoint

Before implementation, check each screen against the four acceptance scenarios in [prototype-scope.md](prototype-scope.md). Defer any screen that does not contribute to one of them.
