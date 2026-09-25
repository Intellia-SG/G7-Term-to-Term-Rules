# RuleQuest — Module PRD
**Grade 7 · Term-to-Term Rules**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 7, {{TOPIC}} = Term-to-Term Rules, {{SPECIAL_INSTRUCTIONS}} = none supplied, defaults assumed throughout)*

---

## 1. Overview

RuleQuest teaches the *generative* side of sequences: not "what's the formula for term *n*," but "what single action — or short chain of actions — takes you from one term to the next?" It covers single-operation rules (add/subtract/multiply/divide), compound two-step rules, working backwards through a rule to recover an earlier term, classifying a rule's type, and Fibonacci-type sequences. It's framed as an inventor's workshop: every world is a "sequence machine" that turns one number into the next, and the central skill is figuring out — and sometimes reversing — how the machine works.

## 2. Background

This is the fifth Grade 7 (Secondary 1) module built against the platform blueprint's reference architecture, following **EquationQuest**, **PatternQuest**, **MosaicQuest**, and **ProgressionQuest**. It reuses `G2-Money-Money-main`'s five-phase pedagogical architecture per platform convention.

**Family scope map** (five Grade 7 modules now share this pattern-adjacent space — kept here so the catalogue stays coherent):

| Module | Owns |
|---|---|
| PatternQuest | Informal linear/arithmetic patterns; deriving `nth term = an + b`; special named sequences; figure patterns |
| MosaicQuest | The *spatial/geometric* side — repeating vs. growing, rotation, reflection, symmetry |
| ProgressionQuest | The *formal* arithmetic-progression treatment — named `a`/`d`, `Tn = a+(n-1)d`, interpolation, means, sums |
| **RuleQuest (this module)** | The *generative* rule itself — single-step and compound term-to-term rules, working backwards, rule-type classification, Fibonacci-type sequences — explicitly **not** deriving any position-to-term formula, arithmetic or otherwise |
| EquationQuest | Solving linear equations from word problems (a separate topic entirely) |

## 3. Standards Alignment

**Source and honest positioning:** Singapore's MOE Secondary 1 "Number Patterns" chapter (PatternQuest's source) already uses "term-to-term rule" as vocabulary, but scopes it to constant-difference (arithmetic) sequences on the way to a general term. This module goes wider: it treats the term-to-term rule as the object of study in its own right, covering multiplicative (geometric-flavoured) rules, compound two-step rules, and Fibonacci-type rules — content that doesn't map to a single Singapore MOE Sec1 chapter as cleanly as the prior four modules' topics did. The closest well-documented curriculum match found is the **UK/Cambridge Checkpoint KS3 "sequences" strand**, which explicitly separates term-to-term rules from position-to-term rules and sequences this content across Year 7–8: simple single-operation rules and continuing a sequence are solidly Year 7 (≈ Grade 7) content, while compound two-step rules, formal backward-solving, and Fibonacci-type sequences skew toward Year 8 — one year ahead, not the multi-year jump flagged for ProgressionQuest.

**Explicit scoping split from the sibling modules (see family map in §2):**
- This module never derives or asks for an algebraic general term of any kind — that's PatternQuest's and ProgressionQuest's territory. A term-to-term rule here is always described as an *action* ("add 4," "multiply by 2, then subtract 3"), never converted into a formula in *n*.
- Geometric-flavoured (multiply/divide) rules are introduced here as term-to-term actions only — no geometric general-term formula (`a·r^(n-1)`) is taught, since that would reopen the same out-of-scope territory PatternQuest and ProgressionQuest both already excluded (formal GP treatment).
- Fibonacci-type sequences are introduced here for the first time in the module family, purely as a term-to-term (recursive) idea — no closed-form treatment exists at this level, so none is attempted.

**In-scope skills:**
- Stating the term-to-term rule of a sequence involving a single operation, in words.
- Verifying a proposed rule against **every** consecutive pair in a sequence, not just the first, and identifying when a sequence doesn't actually follow a stated rule.
- Applying a single-operation rule to generate subsequent terms.
- Applying a **compound** (two-step) rule (e.g. "double, then subtract 3") to generate subsequent terms.
- Working **backwards** through a rule — including a compound rule — to find an earlier term, given a later term and the rule (requiring both reversed operations *and* reversed order for compound rules).
- Classifying a sequence's rule type: arithmetic (constant add/subtract), geometric (constant multiply/divide), or neither (e.g. Fibonacci-type).
- Recognising and continuing a Fibonacci-type sequence (each term formed from the sum of the previous two).
- Applying term-to-term reasoning to a multi-step real-world scenario.

**Adjacent/prerequisite skills treated as bridge only, not tested:**
- **Any position-to-term/general-term formula** (arithmetic or geometric) — explicitly out of scope per the family split above.
- **Quadratic/non-linear difference-based sequences** (second-difference method) — same exclusion already established across the sibling modules.
- **Formal geometric progression notation** (`a`, `r`, sum formulas) — referenced only as "some machines multiply instead of add," never tested.

**Domain conventions to encode as house style:**
- A rule is always described as an **operation**, never as a number — directly countering the single most commonly documented error for this exact topic (students writing the sequence's first term when asked for the rule).
- Every "verify the rule" worked example checks the rule against **every** given consecutive pair, never stops after the first.
- Reversing a compound rule is always taught as a two-part habit: swap each operation for its opposite, **and** reverse the order they're applied in — both parts are drilled, since research shows students commonly do only the first.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. State the term-to-term rule of a sequence involving a single operation, in words.
2. Verify a proposed term-to-term rule against every consecutive pair in a sequence and identify when a sequence doesn't follow it.
3. Apply a single-operation rule to generate subsequent terms, given the first term.
4. Apply a compound (two-step) rule to generate subsequent terms.
5. Work backwards through a rule — including a compound rule — to find an earlier term, given a later term.
6. Classify a sequence's rule type as arithmetic, geometric, or neither.
7. Recognise and continue a Fibonacci-type sequence.
8. Apply term-to-term reasoning to a multi-step real-world scenario and justify the prediction.

Ordering runs foundational → applied (state/verify a single-step rule → apply it forward → compound rules → backward-solving → classify rule types → Fibonacci-type → applied multi-step), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.
- **Simulate phase:** the standard 4 required, archetype-mapped stations (no special-instruction deviation this time — see §6).

## 6. Enhancement Requests / Special Instructions

None supplied for this build. Defaults applied: 4-panel Story (justified §8.2), Singaporean-multicultural naming for the two characters (§7), theme-specific mascot override with stated rationale (§7), and the **standard single-pass 4-station Simulate design** (§8.3) — unlike ProgressionQuest, no special instruction asked for extra richness here, so this module follows the platform's baseline Simulate treatment rather than that module's elevated one. The Concept Discovery Lab confirmation-question tension (flagged in three of the four prior PRDs, and deliberately resolved only for ProgressionQuest) is **not** re-resolved here by default — see §15.4.

## 7. Module Identity

- **Module name:** **RuleQuest**
- **Story theme:** an inventor's workshop — every world centres on a "sequence machine" that turns one number into the next, and the throughline question is "what does this machine actually *do* — and can you make it run backwards?" Suits the Secondary 1 age band's tolerance for a more abstract, project-based setting.
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from all four sibling modules' pairs):
  - **Zhi Hao** — methodical, always tests a rule against every pair of terms before trusting it.
  - **Nurul** — quick to spot a likely rule, occasionally states the first term when asked for the rule itself — a recurring, narratively-reinforced version of the module's headline misconception (§15).
- **Mascot: Sprocket the Beaver 🦫** *(override, with stated rationale)* — a beaver's natural association with building and engineering is a strong, specific fit for a machine/workshop theme, distinct from the owl, fox, chameleon, and robot mascots already used across the sibling modules.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"A dusty machine in the workshop's attic hums to life. Feed it a number, and out comes another — but nobody remembers what it does. Can you figure out the rule… and run it backwards to find out where the sequence started?"*

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Dusty Machine | Hook: a mystery sequence machine with an unknown rule | Zhi Hao and Nurul find the machine and start feeding it numbers. |
| 2 | A Rule Is an Action | Vocabulary: a rule is an operation, not a number; check every pair | Sprocket the Beaver corrects Nurul when she names a number instead of a rule. |
| 3 | Two Gears, One Machine | Formal toolkit: compound rules, and reversing a machine (swap operations, reverse order) | Sprocket demonstrates a two-gear machine and shows how to run it in reverse to recover an earlier reading. |
| 4 | Starting the Machine's Story | Worked application: verifying a compound rule, then reversing it to recover the very first input | The pair reverse-engineers the workshop's oldest machine and restores its original starting number. |

### 8.3 Simulate — 4 stations (archetype-mapped)
Summary (full technical spec in the companion TRD):

| Station | Archetype | Premise |
|---|---|---|
| The Sequence Machine | Concept Discovery Lab | Student sets an input and picks one or two operations from a set of gear dials, watching numbers visibly flow through the machine to produce a live output sequence — builds felt intuition for how a rule (single or compound) generates a whole sequence. |
| Calibrate the Machine | Build-to-Target Challenge | Student adjusts the machine's operation(s) to make its live output sequence match a target sequence shown alongside — a tuning challenge with a tolerance/exact-match check and a retry loop. |
| Reverse Engineer the Machine | Multi-Step/Composite Construction | Given only a jammed machine's *later* output terms, the student first determines the compound rule by testing candidate operations against consecutive pairs, then runs the machine backward step-by-step to recover the original first input — combines rule-verification and backward-solving, the module's two most advanced skills. |
| Spot the Broken Gear | Error-Detective | A fellow apprentice's attempted rule-statement or reversal contains one seeded, realistic mistake (most often: stating the first term instead of the rule, checking only the first pair, or reversing operations without reversing their order); the student finds and fixes it. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's two headline misconceptions: **naming the first term instead of describing the rule**, and **reversing a compound rule's operations without also reversing their order**. Followed by the standard scorecard and a reflection prompt ("Which machine was hardest to run backwards, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | Reading the Blueprint | `state-single-step-rule` | State a single-operation term-to-term rule in words | The Silent Blueprint 📋 | Apprentice Badge |
| 1 | Testing the Machine | `verify-rule-every-pair` | Verify a proposed rule against every consecutive pair | The Faulty Tester 🔧 | Inspector's Badge |
| 2 | Running the Machine Forward | `apply-single-step-rule` | Apply a single-operation rule to generate terms | The Runaway Gear ⚙️ | Operator's Badge |
| 3 | The Two-Gear Machine | `apply-compound-rule` | Apply a compound (two-step) rule to generate terms | The Jammed Two-Gear ⚙️⚙️ | Mechanic's Badge |
| 4 | Reverse Engineering | `work-backwards-single-step` | Work backwards through a single-step rule | The Backwards Bandit ↩️ | Reverse Badge |
| 5 | Full Reverse | `work-backwards-compound-rule` | Work backwards through a compound rule | The Double-Reverse Rogue 🔄 | Master Reverser Badge |
| 6 | Sort the Machines | `classify-rule-type` | Classify a rule as arithmetic, geometric, or neither | The Mislabeled Machine 🏷️ | Classifier Badge |
| 7 | The Twin-Input Machine | `fibonacci-type-sequences` | Recognise and continue a Fibonacci-type sequence | The Twin-Input Trickster 🔀 | Fibonacci Badge |
| 8 | The Inventor's Challenge | `applied-multi-step-rule` | Full applied multi-step real-world scenario | The Grand Contraption 🏗️ | Inventor's Badge |
| 9 | The Grand Workshop Showcase | `mixed-review` | Mixed review of every concept above; hardest boss | The Master Inventor 🎩 | Chief Engineer Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"What is the term-to-term rule for 4, 9, 14, 19, …?"* → "Add 5" ✓ (headline distractor: "4," reflecting the first-term-as-rule misconception)
- **World 1:** *"Does 'add 3' correctly describe 2, 5, 8, 12?"* → "No — the gap between 8 and 12 is 4, not 3" ✓
- **World 2:** *"A machine's rule is 'multiply by 3.' Starting at 2, what's the 4th term?"* → `54` ✓ (2→6→18→54)
- **World 3:** *"A machine's rule is 'double, then subtract 1.' Starting at 3, find the 3rd term."* → `9` ✓ (3→5→9)
- **World 4:** *"A machine's rule is 'add 6.' The 4th term is 25. Find the 3rd term."* → `19` ✓
- **World 5:** *"A machine's rule is 'double, then subtract 1.' The 3rd term is 9. Find the 1st term."* → `3` ✓ (reverse: +1 then ÷2, applied in reverse order: 9→10→5→ wait recompute — reverse of term3→term2 is (9+1)/2=5, reverse of term2→term1 is (5+1)/2=3) → headline distractor reflects reversing operations but not their order.
- **World 6:** *"Is 3, 6, 12, 24 arithmetic, geometric, or neither?"* → "Geometric" ✓
- **World 7:** *"A Fibonacci-type sequence starts 2, 5. Find the next two terms."* → `7, 12` ✓
- **World 8:** *"A savings account starts at $10 and doubles every year. How much is in it after 5 years?"* → `$160` ✓
- **World 9:** mixed-type item combining a compound-rule reversal (World 5) with a rule-type classification (World 6).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Gear Turned ⚙️ |
| 5-answer streak | Smooth Running 🔧 |
| 10-answer streak | Well-Oiled Streak 🔥 |
| All 4 Simulate stations complete | Full Toolbox 🧰 |
| Any world scores 3 stars | Machine Perfected ⭐⭐⭐ |
| Any Boss Battle won | Malfunction Fixed 🛠️ |
| 20+ questions answered in Practice | Dedicated Tinkerer 🔩 |
| Full 5-phase journey complete | Master Inventor Badge 🏆 |

## 11. Audio & Narration Content Rules

Topic-specific terms that must always be spoken in full:
- "term-to-term rule" always spoken in full, never abbreviated.
- A rule is always narrated as an action ("add 4," "multiply by 2, then subtract 3"), **never** as a bare number — reinforcing the house-style convention at the audio level too.
- Compound rules are always narrated in the correct left-to-right order ("first… then…"), matching the order they must be applied in.
- When narrating a rule reversal, narration explicitly names both parts of the habit: "opposite operation" and "reverse order."
- "Fibonacci-type" is paired with a plain-language explanation ("each term is the sum of the two before it") on first use per world, never assumed familiar.

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's Secondary-1 sizing precedent. The Sequence Machine's gear/dial controls are never colour-only — every operation is also text-labelled. All machine interactions require explicit +/− keyboard-operable equivalents alongside any drag/dial control.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel:
1. The dusty attic machine, Zhi Hao and Nurul discovering it.
2. Sprocket the Beaver correcting Nurul's "the rule is 4" mistake.
3. Sprocket demonstrating a two-gear machine running in reverse.
4. The pair restoring the workshop's oldest machine's original starting number.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- Every generated compound rule's reverse is verified to produce clean integers across the full visible sequence — not just the forward direction.
- World 1's verification items include sequences that break only at a later pair (never all breaking at the first pair), so the "check every pair" skill is genuinely testable.
- Distractors are dominated by the two headline misconceptions (first-term-as-rule; reversing operations without reversing order) rather than arbitrary wrong answers.
- Fibonacci-type sequence generation stays within a visually/numerically friendly range — no runaway large numbers within the visible term count.
- All 4 Simulate stations are genuinely interactive, not static reveal-and-answer screens.

## 15. Assumptions & Open Questions

1. **Modest grade-level stretch (smaller than ProgressionQuest's flag, still worth naming):** single-step rules are solidly Grade-7-appropriate; compound rules, formal backward-solving, and Fibonacci-type content sit roughly one year ahead in the closest comparable curriculum (§3) — recommend confirming this is an acceptable stretch within a single module rather than needing its own split.
2. **Family scope coherence:** the scope map in §2 and the explicit split in §3 are this PRD's proposed way of keeping five Grade-7 pattern-adjacent modules from contradicting each other — worth a single consolidated review once all five are built, rather than checking each pairwise.
3. **Character names and mascot** (Zhi Hao, Nurul, Sprocket the Beaver) are proposed defaults, not yet stakeholder-approved.
4. **Concept Discovery Lab tension — not re-resolved here.** ProgressionQuest resolved this tension (pure free-play) for itself only, under an explicit special instruction. No such instruction was given for this module, so The Sequence Machine station defaults back to the blueprint's standard archetype (free exploration plus one light confirmation question), consistent with EquationQuest/PatternQuest/MosaicQuest rather than ProgressionQuest. Worth a single decision across the whole family rather than resolving it per-module based on whether richness was explicitly requested.
