// src/data/storyContent.js
// 4 Widescreen Story Panels for RuleQuest (Grade 7 Term-to-Term Rules)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Dusty Machine ⚙️",
    text: "Deep in the workshop's attic, Zhi Hao and Nurul wiped a thick layer of dust from an antique contraption. Brass gears hummed as Zhi Hao turned the crank. Nurul dropped in a numbered token reading 4, and the machine chimed, spitting out 9! Feeding 9 back into the hopper produced 14, and 14 turned into 19. \"Look at the sequence!\" Nurul exclaimed. \"4, 9, 14, 19… but what is the machine actually doing to each number?\"",
    highlight: "⚙️ Sequence: 4, 9, 14, 19… A machine turns each term into the next!",
    character: "Zhi Hao & Nurul",
    characterEmoji: "🧑🏻",
    imageBg: "radial-gradient(circle, #457b9d 0%, #1d3557 100%)",
    imageEmoji: "⚙️",
  },
  {
    panel: 1,
    title: "A Rule Is an Action 🦫",
    text: "\"I know the rule!\" Nurul declared proudly. \"The rule is 4!\" Suddenly, Sprocket the Beaver popped up from behind a stack of blueprints, wagging his tail. \"Hold your gears, Nurul! Four is just where the sequence started. A term-to-term rule is an ACTION — it tells you how to travel from one term to the next!\" Zhi Hao nodded: \"From 4 to 9 is add 5. From 9 to 14 is add 5. From 14 to 19 is add 5. The rule is 'Add 5', and it checks out across every single pair!\"",
    highlight: "🦫 Rule rule: Always an ACTION (e.g. 'Add 5'), never a starting number! Verify every pair.",
    character: "Sprocket",
    characterEmoji: "🦫",
    imageBg: "radial-gradient(circle, #e76f51 0%, #b23a22 100%)",
    imageEmoji: "🔧",
  },
  {
    panel: 2,
    title: "Two Gears, One Machine ⚙️⚙️",
    text: "Sprocket led them to a grander contraption with two interlocking gears. \"Some machines use compound rules — two actions in a chain! For example, double the number, then subtract 3.\" Nurul watched in awe: 5 doubled is 10, minus 3 gives 7. Then 7 doubled is 14, minus 3 gives 11! \"Now for the master trick,\" whispered Sprocket. \"To run a compound machine in reverse, you must do two things: swap every operation for its opposite, AND reverse the order they run in!\"",
    highlight: "🔄 Reversing a rule: 1) Swap operations to their opposite · 2) Reverse the order they run!",
    character: "Sprocket",
    characterEmoji: "🦫",
    imageBg: "radial-gradient(circle, #e9c46a 0%, #c49a2a 100%)",
    imageEmoji: "🔄",
  },
  {
    panel: 3,
    title: "Starting the Machine's Story 🏆",
    text: "At the centre of the workshop stood the oldest machine of all, its starting dial locked. Its 3rd term read 17, and its rule was 'double, then add 1.' \"Let's work backwards to find where it began!\" Zhi Hao said. \"The reverse rule is: subtract 1, then halve!\" Nurul took the controls: 17 minus 1 is 16, halved gives 8. Then 8 minus 1 is 7... wait, 17 was term 3, so term 2 is 8, and term 1 is (8 - 1) / wait, (9)? Nurul adjusted: \"Term 1 was 5! (5×2+1=11... let's check: 3→7→15 or 4→9→19!)\" The brass dial clicked into place, spinning smoothly. \"You've mastered the sequence machine!\" Sprocket cheered.",
    highlight: "🏆 Master habit: Reversing 'double, then add 1' is 'subtract 1, then halve' in reverse order!",
    character: "Zhi Hao & Nurul",
    characterEmoji: "🌟",
    imageBg: "radial-gradient(circle, #2a9d8f 0%, #17534c 100%)",
    imageEmoji: "🏆",
  },
];
