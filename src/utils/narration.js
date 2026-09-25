// src/utils/narration.js
// Narration script builder for RuleQuest (Grade 7 Term-to-Term Rules)
// Strictly follows PRD §11 content rules and maintains 1:1 on-screen parity

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to RuleQuest! Let's uncover the secrets of the workshop's sequence machines!"),
    say("A dusty machine in the workshop's attic hums to life. Feed it a number, and out comes another — but nobody remembers what it does!"),
    ask("Can you figure out the term-to-term rule… and run the machine backwards to find out where the sequence started?"),
    cheer("Let's investigate how sequence machines work and how to run them backwards!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("Deep in the workshop's attic, Zhi Hao and Nurul wiped a thick layer of dust from an antique contraption."),
      say("Brass gears hummed as Zhi Hao turned the crank. Nurul dropped in a numbered token reading 4, and the machine chimed, spitting out 9!"),
      say("Feeding 9 back into the hopper produced 14, and 14 turned into 19."),
      think("Look at the sequence! Nurul exclaimed. 4, 9, 14, 19… but what is the machine actually doing to each number?"),
    ],
    [
      say("I know the rule! Nurul declared proudly. The rule is 4!"),
      say("Suddenly, Sprocket the Beaver popped up from behind a stack of blueprints, wagging his tail. Hold your gears, Nurul! Four is just where the sequence started."),
      emphasize("A term-to-term rule is an ACTION — it tells you how to travel from one term to the next!"),
      say("Zhi Hao nodded: From 4 to 9 is add 5. From 9 to 14 is add 5. From 14 to 19 is add 5. The rule is 'Add 5', and it checks out across every single pair!"),
    ],
    [
      say("Sprocket led them to a grander contraption with two interlocking gears."),
      say("Some machines use compound rules — two actions in a chain! For example, double the number, then subtract 3."),
      say("Nurul watched in awe: 5 doubled is 10, minus 3 gives 7. Then 7 doubled is 14, minus 3 gives 11!"),
      emphasize("Now for the master trick, whispered Sprocket. To run a compound machine in reverse, you must do two things: swap every operation for its opposite, AND reverse the order they run in!"),
    ],
    [
      say("At the centre of the workshop stood the oldest machine of all, its starting dial locked. Its 3rd term read 17, and its rule was 'double, then add 1.'"),
      say("Let's work backwards to find where it began! Zhi Hao said. The reverse rule is: subtract 1, then halve!"),
      say("Nurul took the controls: 17 minus 1 is 16, halved gives 8. Then 8 minus 1 is 7... wait! Term 1 was 3!"),
      cheer("The brass dial clicked into place, spinning smoothly. You've mastered the sequence machine! Sprocket cheered."),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Sequence Machine Lab!"),
      instruct("Set your starting input number and pick your operation gears to see numbers flow through the machine and generate a live sequence!"),
    ],
    [
      instruct("Welcome to Station B — Calibrate the Machine!"),
      instruct("Tune the machine's gears and operation values using the plus and minus controls to match the target sequence!"),
    ],
    [
      instruct("Welcome to Station C — Reverse Engineer the Machine!"),
      instruct("Inspect the jammed machine's later terms, test candidate operations across consecutive pairs, and step backwards to recover Term 1!"),
    ],
    [
      instruct("Welcome to Station D — Spot the Broken Gear!"),
      instruct("Inspect the apprentice's working log, tap the line with the flaw, and select the correct repair!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are in top gear! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That gear turned perfectly! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, test every pair, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first hint! Look at the transition between consecutive terms.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final clue! Remember that a term-to-term rule is an action, not a starting number.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular job on this workshop machine world! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Repair the malfunctioning machine by answering every question correctly!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You repaired the rogue machine and claimed your Workshop Badge! 🛠️")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the golden rules of term-to-term sequences and check your scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered term-to-term rules, compound machines, and reverse engineering! You are a Chief Engineer! 🏆")
  ];
}
