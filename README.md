# RuleQuest — Grade 7 Term-to-Term Rules

RuleQuest is a rich, gamified educational module for **Grade 7 (Secondary 1) Mathematics**, focusing on the **generative side of sequences**:
- Describing term-to-term rules as actions (e.g. "Add 5", "Multiply by 2, then subtract 3") rather than numbers.
- Verifying candidate rules across **every** consecutive pair, never stopping at the first gap.
- Forward sequence generation with single and compound two-gear rules.
- Algorithmic backward solving (reversing operations AND reversing the order they are applied).
- Classifying sequence types (arithmetic, geometric, or neither).
- Continuing Fibonacci-type sequences (sum of previous two terms).
- Applied multi-step workshop problem solving.

---

## 🏗️ 5-Phase Pedagogical Architecture

1. **Wonder Phase**: The Mystery of the Sequence Machine. An antique machine in the workshop attic hums to life, spitting out 4 ➔ 9 ➔ 14 ➔ 19…
2. **Story Phase (4 Panels)**:
   - *Panel 1: The Dusty Machine* — Zhi Hao and Nurul discover the antique contraption.
   - *Panel 2: A Rule Is an Action* — Sprocket the Beaver corrects Nurul's misconception ("The rule is 4!"), explaining that a rule is an action ('Add 5') that must hold for every pair.
   - *Panel 3: Two Gears, One Machine* — Sprocket demonstrates a two-gear machine running in reverse (swap operations, reverse order).
   - *Panel 4: Starting the Machine's Story* — The pair reverse-engineers the oldest machine and recovers starting Term 1 = 3.
3. **Simulate Phase (4 Archetype-Mapped Stations)**:
   - *Station A: The Sequence Machine* (Concept Discovery Lab) — Free exploration of single/compound gear dials + confirmation question.
   - *Station B: Calibrate the Machine* (Build-to-Target Challenge) — Tuning operations via +/− controls to match target sequences.
   - *Station C: Reverse Engineer the Machine* (Multi-Step Construction) — Identifying the forward rule from jammed logs, then walking backwards step-by-step.
   - *Station D: Spot the Broken Gear* (Error-Detective) — Tapping faulty lines in apprentice reasoning logs and repairing misconceptions.
4. **Practice Phase (Play Phase)**:
   - 10 Worlds (Worlds 0 to 9) × 10 Questions = 100 procedurally generated questions.
   - 4 Practice Modes: Guided Practice, Independent Practice, Timed Challenge, and Boss Battles.
   - 10 Boss Battles with 3 lives and unique badge rewards.
5. **Reflect Phase**:
   - 3 Concept Reflection questions targeting headline misconceptions.
   - Learning journal prompt ("Which machine was hardest to run backwards, and why?").
   - Gamification scorecard with XP, stars, and unlocked badges.

---

## 🎨 Art Brief for Story Panels

| Panel | Title | Visual Description |
|---|---|---|
| 1 | The Dusty Machine | Zhi Hao and Nurul discover the antique brass sequence machine with spinning gears and glowing dials in a warm, dusty attic workshop. |
| 2 | A Rule Is an Action | Sprocket the Beaver with goggles and toolbelt points at a chalkboard blueprint showing `2, 4, 8, __, 32` as Zhi Hao and Nurul listen attentively. |
| 3 | Two Gears, One Machine | Sprocket demonstrates a two-gear machine with illuminated reverse arrows showing compound rule reversal. |
| 4 | Starting the Machine's Story | Zhi Hao and Nurul high-five in front of the restored machine displaying starting number 3 with Sprocket cheering. |

---

## 🛠️ Tech Stack & Scripts

- **Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS tokens (`styles/design-tokens.css`, `styles/globals.css`, `Stations.css`) + Tailwind utilities
- **Animations**: Framer Motion
- **Voice Pipeline**: ElevenLabs Alice (`scripts/generate_audio.js`, `src/utils/audioMap.js`)

### Available Commands:
```bash
# Start local development server
npm run dev

# Run production build
npm run build

# Run mathematical correctness and stress test suite (30,000 Qs + reverse audits)
node scripts/qa_audit.js

# Generate narration audio (requires VITE_ELEVENLABS_API_KEY in .env.local)
npm run generate-audio
```
