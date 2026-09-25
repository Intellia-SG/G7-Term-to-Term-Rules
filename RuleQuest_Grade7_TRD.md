# RuleQuest — Module TRD
**Grade 7 · Term-to-Term Rules**
*(Technical companion to `RuleQuest_Grade7_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `rule-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling — `equation-quest-main`, `pattern-quest-main`, `mosaic-quest-main`, or `progression-quest-main` — is designated as the actual clone source at build time.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, but confirm against the actual clone source.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally across the 10 concept generators in §4.1. Unlike ProgressionQuest, this module keeps the standard single-pass Simulate architecture (no 5th tab, no multi-round station state) — if cloning from `progression-quest-main`, actively strip that module's 5-tab/multi-round scaffolding rather than carrying it forward unused.
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
5. **Leftover branding strings.** Check `index.html`'s `<title>` and `README.md` for stale references from whichever module was actually cloned, including leftover mascot/character references from any of the four prior Grade 7 modules.

**Module-specific risk to add:** this module's correctness depends on **reverse-operation arithmetic being genuinely, algorithmically correct** — not just forward generation. A bug in the reverse-rule logic (§4.4) could silently produce a "correct" backward-solving answer that's actually wrong, which is a different and easier-to-miss failure mode than a simple clean-number check would catch (see §11 Risks).

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim (same dependency versions as the four prior Grade 7 TRDs). `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is.

## 3. Folder Structure

```
rule-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Sprocket the Beaver)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── RuleMachineVisual.jsx        # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import RuleMachineVisual
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels (standard 4-tab architecture — see §1.3)
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── TheSequenceMachine.jsx      # NEW — Concept Discovery Lab — §6
│   │       ├── CalibrateTheMachine.jsx     # NEW — Build-to-Target Challenge — §6
│   │       ├── ReverseEngineerTheMachine.jsx # NEW — Multi-Step/Composite Construction — §6
│   │       ├── SpotTheBrokenGear.jsx       # NEW — Error-Detective — §6
│   │       └── Stations.css                # MODIFY: extend with gear/dial and machine-flow visual classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Zhi Hao / Nurul / Sprocket — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   └── ruleMachineMath.js     # NEW — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "Reading the Blueprint", emoji: "📋", accent: "var(--world-0)",
    description: "State a single-operation term-to-term rule in words",
    conceptFocus: "state-single-step-rule",
    boss: { name: "The Silent Blueprint", emoji: "📋", reward: "Apprentice Badge" } },
  { id: 1, name: "Testing the Machine", emoji: "🔧", accent: "var(--world-1)",
    description: "Verify a proposed rule against every consecutive pair",
    conceptFocus: "verify-rule-every-pair",
    boss: { name: "The Faulty Tester", emoji: "🔧", reward: "Inspector's Badge" } },
  { id: 2, name: "Running the Machine Forward", emoji: "⚙️", accent: "var(--world-2)",
    description: "Apply a single-operation rule to generate terms",
    conceptFocus: "apply-single-step-rule",
    boss: { name: "The Runaway Gear", emoji: "⚙️", reward: "Operator's Badge" } },
  { id: 3, name: "The Two-Gear Machine", emoji: "⚙️", accent: "var(--world-3)",
    description: "Apply a compound (two-step) rule to generate terms",
    conceptFocus: "apply-compound-rule",
    boss: { name: "The Jammed Two-Gear", emoji: "⚙️", reward: "Mechanic's Badge" } },
  { id: 4, name: "Reverse Engineering", emoji: "↩️", accent: "var(--world-4)",
    description: "Work backwards through a single-step rule",
    conceptFocus: "work-backwards-single-step",
    boss: { name: "The Backwards Bandit", emoji: "↩️", reward: "Reverse Badge" } },
  { id: 5, name: "Full Reverse", emoji: "🔄", accent: "var(--world-5)",
    description: "Work backwards through a compound rule",
    conceptFocus: "work-backwards-compound-rule",
    boss: { name: "The Double-Reverse Rogue", emoji: "🔄", reward: "Master Reverser Badge" } },
  { id: 6, name: "Sort the Machines", emoji: "🏷️", accent: "var(--world-6)",
    description: "Classify a rule as arithmetic, geometric, or neither",
    conceptFocus: "classify-rule-type",
    boss: { name: "The Mislabeled Machine", emoji: "🏷️", reward: "Classifier Badge" } },
  { id: 7, name: "The Twin-Input Machine", emoji: "🔀", accent: "var(--world-7)",
    description: "Recognise and continue a Fibonacci-type sequence",
    conceptFocus: "fibonacci-type-sequences",
    boss: { name: "The Twin-Input Trickster", emoji: "🔀", reward: "Fibonacci Badge" } },
  { id: 8, name: "The Inventor's Challenge", emoji: "🏗️", accent: "var(--world-8)",
    description: "Full applied multi-step real-world scenario",
    conceptFocus: "applied-multi-step-rule",
    boss: { name: "The Grand Contraption", emoji: "🏗️", reward: "Inventor's Badge" } },
  { id: 9, name: "The Grand Workshop Showcase", emoji: "🎩", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Master Inventor", emoji: "🎩", reward: "Chief Engineer Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  zhiHao: { name: "Zhi Hao", role: "The methodical tester", emoji: "🧑🏻", colour: "var(--char-1)", mascotEmoji: "🦫" },
  nurul:  { name: "Nurul",   role: "The quick rule-spotter", emoji: "👧🏽", colour: "var(--char-2)", mascotEmoji: "🦫" },
  sprocket: { name: "Sprocket the Beaver", role: "Mascot & mentor", emoji: "🦫", colour: "var(--mascot)", mascotEmoji: "🦫" },
};
export const MASCOT = { name: "Sprocket the Beaver", emoji: "🦫" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The Dusty Machine," "A Rule Is an Action," "Two Gears, One Machine," "Starting the Machine's Story."

### 4.4 Question Bank — Procedural Generation

**`utils/ruleMachineMath.js`** — pure helper functions shared by the question generator and the Simulate stations:

| Function | Purpose |
|---|---|
| `pickSingleOperation()` | Draws one operation from a curated set: `{op: "add"\|"subtract", value}` or `{op: "multiply"\|"divide", value}`, with divide/multiply values constrained to small integers (2–5) that keep results clean. |
| `pickCompoundOperation()` | Chains two `pickSingleOperation()`-style steps into an ordered pair, e.g. `[{op:"multiply",value:2},{op:"subtract",value:3}]`. |
| `applyOperation(term, operation)` | Applies a single operation to a term. |
| `applyRule(term, ruleSteps)` | Applies an ordered list of operations (1 or 2 steps) to a term — the shared forward-generation engine. |
| `generateSequence(firstTerm, ruleSteps, length)` | Produces `length` terms by repeatedly calling `applyRule`. |
| `reverseOperation(operation)` | Returns the inverse of a single operation (`add ↔ subtract`, `multiply ↔ divide`, same value) — the **single source of truth** for what counts as a correct reversal; never hand-computed per question template. |
| `reverseRule(ruleSteps)` | Returns the correctly reversed rule for a compound sequence: **reverses the order of the steps** and **inverts each operation** — this is the one function responsible for correctly encoding both halves of the reversal habit taught in PRD §3; the headline "reversed operations but not their order" distractor is generated by deliberately calling a version that inverts operations without reversing order, never hand-authored. |
| `applyReversedRule(term, ruleSteps, stepsBack)` | Walks a term backwards through `reverseRule(ruleSteps)` for `stepsBack` steps — used for both World 4/5 question generation and the Reverse Engineer the Machine station. |
| `verifyRuleAgainstSequence(sequence, ruleSteps)` | Checks the proposed rule against **every** consecutive pair in `sequence`, returning `{valid: bool, failsAtIndex: number|null}` — used for World 1 generation and the Testing/Error-Detective stations; `failsAtIndex` is deliberately varied across the full range when generating "invalid rule" examples, never clustered at index 0. |
| `classifyRuleType(ruleSteps)` | Returns `"arithmetic"`, `"geometric"`, or `"neither"` for a single-operation rule; compound and Fibonacci-type rules are always classified `"neither"`. |
| `generateFibonacciTypeSequence(term1, term2, length)` | Produces a Fibonacci-type sequence from two curated small positive starting terms, capped so terms stay within a friendly display range across the visible length. |
| `formatRuleString(ruleSteps)` | Renders a rule to display string ("multiply by 2, then subtract 3") and to the narration-ready spoken form per PRD §11 — never renders a rule as a bare number. |

**"Clean number" constraints (hard requirements, not inline magic numbers):**
- Every `pickSingleOperation`/`pickCompoundOperation` combination is checked so that both the forward sequence **and** its reverse produce clean integers across the full visible range — this is stricter than prior modules' single-direction clean-number checks, since this module's headline skill is specifically the reverse direction.
- `generateFibonacciTypeSequence`'s starting pair and length are capped so no displayed term exceeds a friendly range (mirroring the same rendering-friendliness discipline used for PatternQuest's figure patterns).
- `verifyRuleAgainstSequence`'s "invalid rule" examples are generated with `failsAtIndex` spread across the full range of possible break points, never defaulting to index 0, so the "check every pair" skill (§3) is genuinely testable rather than trivially solvable by checking only the first gap.
- `classifyRuleType`'s three categories are drawn only from genuinely unambiguous cases — never a sequence that could plausibly be read as more than one type.

**`data/questionBank.js` generation:**
One or more template functions per `conceptFocus` (10 concept slugs from §4.1), each producing exactly 4 options — 1 correct + 3 distractors dominated by the two headline misconceptions from PRD §15 (stating the first term instead of the rule; reversing operations without reversing their order for compound rules), plus a secondary share of checking-only-the-first-pair errors and arithmetic/geometric rule-type confusion. Fixed output schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`. Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `RuleMachineVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values: `"machine-flow"` (an input → gear icon(s) → output diagram showing a term flowing through 1–2 operations), `"sequence-strip"` (a strip of terms for continuation/verification questions), `"reverse-flow"` (the same machine-flow diagram run right-to-left, with a clear directional indicator, used for Worlds 4–5), `"fibonacci-pair"` (highlights the two contributing terms feeding into the next one, for World 7).

`compact` prop shrinks rendering for inline use inside `QuestionRenderer.jsx`. Also reused inside the Simulate stations (The Sequence Machine reuses `machine-flow`/`reverse-flow` as its live interactive surface).

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables, a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction. Standard single-pass architecture — no multi-round/multi-step internal state and no 5th bonus tab, unlike ProgressionQuest (§1.3).

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `TheSequenceMachine.jsx` | Concept Discovery Lab | Sets an input number; picks 1 or 2 operations from gear dials (add/subtract/multiply/divide, each with a value control) | The machine visibly processes the input through each gear in sequence, producing a live output sequence rendered via `machine-flow` | Free exploration across both single and compound rules, **plus one confirmation question** ("if the machine subtracts 3 then doubles, what comes out if you put in 5?") per the platform's default archetype (no special-instruction override this time, per PRD §6) |
| `CalibrateTheMachine.jsx` | Build-to-Target Challenge | Adjusts the machine's operation(s) via keyboard-operable +/− controls | A live-generated output sequence renders next to a fixed target sequence; a match/no-match indicator (text-labelled, not colour-only) shows progress | Producing an exact match to the target sequence; a "try another round" loop offers a fresh target before the station is markable complete |
| `ReverseEngineerTheMachine.jsx` | Multi-Step/Composite Construction | Given only later output terms, tests candidate operations against consecutive pairs (via `verifyRuleAgainstSequence`) to determine the compound rule, then steps the machine backward (via `applyReversedRule`) to recover the original first input | The machine-flow diagram updates live at each stage — rule-testing, then the reverse walk-back — with `reverse-flow` visually distinct from the forward direction | Correctly determining the rule **and** correctly recovering the original first input — targets PRD LOs 2 and 5 together |
| `SpotTheBrokenGear.jsx` | Error-Detective | Taps the line of a multi-line rule-statement or reversal attempt containing the seeded mistake, then supplies the correction | The tapped line highlights; mistake pool is dominated by the first-term-as-rule and reversed-operations-wrong-order misconceptions (§10 below), generated via `reverseRule`'s deliberately-wrong sibling function, never hand-authored | Correctly identifying the erroneous line and supplying the fix |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference (standard 4-tab architecture, unlike ProgressionQuest's 5-tab deviation).

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting the first-term-as-rule and reversed-operations-wrong-order misconceptions (PRD §8.5), matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Gear Turned, Smooth Running, Well-Oiled Streak, Full Toolbox, Machine Perfected, Malfunction Fixed, Dedicated Tinkerer, Master Inventor Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as prior modules' TRDs) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules — a rule is always narrated as an action never a bare number, compound rules read in correct left-to-right order, reversals explicitly name both "opposite operation" and "reverse order," "Fibonacci-type" paired with a plain-language explanation on first use per world. After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using an inventor's-workshop palette distinct from the four prior modules' palettes:

| World | Accent (indicative) |
|---|---|
| 0 — Reading the Blueprint | `#457B9D` (blueprint blue) |
| 1 — Testing the Machine | `#E76F51` (rust orange) |
| 2 — Running the Machine Forward | `#2A9D8F` (workshop teal) |
| 3 — The Two-Gear Machine | `#E9C46A` (brass gold) |
| 4 — Reverse Engineering | `#6D6875` (iron grey) |
| 5 — Full Reverse | `#9C6644` (copper brown) |
| 6 — Sort the Machines | `#588157` (workshop green) |
| 7 — The Twin-Input Machine | `#B5838D` (dusty rose) |
| 8 — The Inventor's Challenge | `#FFB703` (spark yellow) |
| 9 — The Grand Workshop Showcase | `#264653` (deep workshop navy — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 10 concept categories; assert no duplicate options, no malformed/`NaN`/`undefined` fields, no operation pairing that produces a non-integer anywhere across the visible sequence (forward *or* reverse direction).
2. **Reverse-arithmetic correctness audit (module-specific, higher priority than a standard clean-number check)** — for every backward-solving question, programmatically re-derive the answer via an independent forward walk from the claimed original term through `applyRule`, confirming it lands on the given later term — this is the direct analogue of MosaicQuest's geometry-correctness audit, adapted for this module's headline risk (a silently-wrong reversal).
3. **Misconception audit** — spot-check that distractors are dominated by the two headline misconceptions (first-term-as-rule; reversed-operations-wrong-order), with a secondary share of check-only-first-pair and arithmetic/geometric confusion, rather than arbitrary numbers.
4. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
5. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes, all 10 Boss Battles, badges) → Reflect — zero console/page errors.
6. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
7. **Accessibility spot-check** — fonts/touch targets at Secondary-appropriate sizing; gear/dial controls text-labelled, not colour-only; all interactions have keyboard equivalents.
8. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders with art-brief README; `README.md` updated and checked for leftover branding from whichever module was cloned; `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **Reverse-arithmetic correctness is this module's single highest-stakes QA surface** (analogous to PatternQuest's coefficient-vs-constant guardrail and MosaicQuest's geometry-correctness audit) — `reverseRule()` and `applyReversedRule()` are the two functions most likely to silently produce a wrong-but-plausible "correct answer" if buggy, since a reversal bug doesn't produce an obviously malformed number, just a wrong one. §10.2's independent forward-verification audit should not be treated as optional.
- **Cloning from `progression-quest-main` risk.** If this module is cloned from the most recent sibling rather than the original reference, its 5-tab/multi-round Simulate scaffolding needs to be actively stripped back down to the platform's standard 4-tab single-pass architecture (§1.3) — carrying it forward unused would be worse than starting from an older, simpler reference.
- **Fifth consecutive Grade-7-family module — family scope coherence risk.** With five modules now sharing pattern-adjacent territory (§2 of the PRD), a future content edit to any one of them has a higher chance than usual of silently duplicating or contradicting a sibling module's scope; the family scope map is meant to be the single source of truth for this and should be kept up to date if any sibling module's scope changes.
- **Concept Discovery Lab tension, still unresolved for this module** (PRD §15.4) — The Sequence Machine keeps the default confirmation-question gate, differing deliberately from ProgressionQuest's free-play resolution; if a future decision standardises the whole family on one approach, this station's completion-gate logic would need revisiting.
