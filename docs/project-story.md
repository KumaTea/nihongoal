# NihonGoal! — Project Story

## Inspiration

Most Japanese-learning apps begin with a fixed vocabulary list and a rigid
daily streak. We wanted to begin somewhere more human: the Japanese a learner
meets in real life. A train ticket, a menu, a headline, a photo from a walk, or
a question they suddenly want to ask should all be valid ways to learn.

NihonGoal! is also our first AI-generated, “vibe coded” app. The project began
as a conversation about what a more personal Japanese tutor could feel like,
then became a working prototype through rapid design, coding, testing, and
iteration with AI as a hands-on collaborator.

The name combines *Nihongo* with a personal goal. The point is not to race
through a universal syllabus; it is to make small, useful Japanese progress in
the direction that matters to each learner.

## What it does

NihonGoal! is an AI-assisted Japanese-learning companion designed for daily
life. A learner chooses a support language and a starting comfort level, then
can begin anywhere:

- Talk with Sensei, a conversational Japanese tutor that suggests a useful
  phrase, kana reading, meaning, and a small practice prompt.
- Paste Japanese into Discover to turn something encountered in the world into
  a saveable learning card. A photo route can do the same with a vision-capable
  provider.
- Read a current NHK NEWS WEB headline, then ask Sensei to write a clearly
  labelled, original reading practice passage at the learner’s level.
- Save, add, edit, and remove language in a personal Library.
- Configure a compatible text model and, if needed, a separate image model.
  Learners provide their own credentials; learning data stays local in the
  prototype and can be exported or imported.

The app deliberately avoids a forced order. Sensei recommends a useful next
step, but the learner can talk, read, discover, look something up, or rest.

## How we built it

We chose Expo, React Native, TypeScript, and Expo Router so the first version
could run in a browser while keeping a practical path to iOS and Android.
React Native components and app-owned design tokens keep the UI portable rather
than tying the product to a web-only implementation.

The prototype uses IndexedDB in the browser and SQLite on native platforms
behind one repository interface. That gives the Library, onboarding profile,
settings, and import/export flow real persistence without requiring a central
server.

AI connections use an OpenAI-compatible adapter. It supports separate text and
image endpoints, provider-specific authentication details, structured JSON
responses, and resilient parsing for providers that add Markdown or labelled
text. The reading route fetches an official NHK RSS feed directly in the
learner’s browser, links to the source, and sends only the selected headline and
summary to the configured model to create original practice content.

For the visual identity, we created the NihonGoal! brand around a rising sun,
an upward path, and a small gold destination point. The app uses a calm,
Japanese-inspired palette and a portable ruby-like presentation that places
kana visibly above the Japanese text on web, iOS, and Android.

## Challenges we ran into

The most interesting challenge was that “OpenAI-compatible” does not mean every
provider behaves the same way. Different providers use different headers,
completion-token parameters, browser CORS policies, and reasoning behaviour.
One reasoning-capable model could spend its response budget thinking and return
no final structured answer, even though the request itself succeeded.

We solved this by separating provider details inside the adapter, using JSON
mode where it is supported, increasing output capacity only for the longer
news-reading task, and accepting clearly labelled fields as a recovery format.
We tested live Sensei, Discover, and Read flows against real configured
providers in a visible Selenium browser session.

The browser-only architecture also made its limits clear. Some publishers do
not permit direct cross-origin feed access, so NihonGoal! uses sources such as
NHK NEWS WEB that can be fetched openly by the learner’s browser. It does not
silently route blocked publisher content through a proxy or copy full articles.

Finally, the prototype had to be compatible with the current Expo Go release on
both iOS and Android. We aligned it to Expo SDK 54 and verified the web build
alongside the mobile-oriented architecture.

## Accomplishments that we're proud of

- Turning an early product conversation into a real, working cross-platform
  prototype.
- Making the AI tutor useful rather than decorative: Sensei, Discover, and
  Read all create saveable learning moments from learner intent or real-world
  source material.
- Keeping learner agency central. There is no compulsory streak or fixed
  activity queue.
- Building genuine local persistence, editable learning items, and portable
  export/import instead of a non-functional demo shell.
- Creating a coherent name, visual identity, intro sequence, and Japanese
  reading presentation for our first vibe-coded app.
- Testing through a real browser with real provider responses, not only mocked
  UI states.

## What we learned

We learned that the product design and the technical design cannot be separated
in an AI-native app. A warm tutor experience depends on practical details such
as response formats, token limits, provider capabilities, and clear failure
messages.

We also learned that “serverless” is not the same as “offline,” and that it has
useful boundaries. Direct browser connections can make a prototype fast and
personal, but providers must permit them and users need clear control over what
is sent. Keeping the AI adapter and local-data layer modular gives us room to
add secure native storage or a server relay later without redesigning the
learning experience.

Most importantly, vibe coding worked best when it was not treated as magic.
The human supplied the vision, taste, priorities, and real-device feedback;
the AI accelerated implementation, documentation, debugging, and testing.

## What's next for NihonGoal!

- Add a proper global lookup and dictionary-pack experience, including JLPT
  lists and learner imports.
- Improve the adaptive learning model: evidence-based ability estimates,
  intelligent review, and an adjustable Focus/fatigue rhythm.
- Expand source-linked reading with additional publishers that support direct
  browser access and give learners more control over interests and difficulty.
- Add optional speech input, TTS, and pronunciation feedback with clear
  capability checks.
- Improve photo discovery with candidate correction and better on-device/mobile
  camera flows.
- Add secure native credential storage, then evaluate sign-in and sync only
  when the local-first learning experience is stable.
- Test on real iOS and Android devices and refine the interface for daily use.

NihonGoal! is still a prototype, but its direction is clear: Japanese learning
should feel less like completing someone else’s course and more like noticing a
new possibility in your own life.
