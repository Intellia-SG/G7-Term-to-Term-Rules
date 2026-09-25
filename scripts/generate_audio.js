// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files for RuleQuest.
// Strictly follows audio_generation_pipeline (5).md specifications and PRD §11 rules.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log("\nℹ️ Notice: VITE_ELEVENLABS_API_KEY is not defined in .env.local.");
  console.log("Audio files can be pre-generated when an API key is provided.\n");
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── INTRO ────────────────────────────────────────────────────────────────
  { text: "Welcome to RuleQuest! Let's uncover the secrets of the workshop's sequence machines!", style: 'celebration' },

  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "A dusty machine in the workshop's attic hums to life. Feed it a number, and out comes another — but nobody remembers what it does!", style: 'statement' },
  { text: "Can you figure out the term-to-term rule… and run the machine backwards to find out where the sequence started?", style: 'question' },
  { text: "Let's investigate how sequence machines work and how to run them backwards!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Deep in the workshop's attic, Zhi Hao and Nurul wiped a thick layer of dust from an antique contraption.", style: 'statement' },
  { text: "Brass gears hummed as Zhi Hao turned the crank. Nurul dropped in a numbered token reading 4, and the machine chimed, spitting out 9!", style: 'statement' },
  { text: "Feeding 9 back into the hopper produced 14, and 14 turned into 19.", style: 'statement' },
  { text: "Look at the sequence! Nurul exclaimed. 4, 9, 14, 19… but what is the machine actually doing to each number?", style: 'thinking' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "I know the rule! Nurul declared proudly. The rule is 4!", style: 'statement' },
  { text: "Suddenly, Sprocket the Beaver popped up from behind a stack of blueprints, wagging his tail. Hold your gears, Nurul! Four is just where the sequence started.", style: 'statement' },
  { text: "A term-to-term rule is an ACTION — it tells you how to travel from one term to the next!", style: 'emphasis' },
  { text: "Zhi Hao nodded: From 4 to 9 is add 5. From 9 to 14 is add 5. From 14 to 19 is add 5. The rule is 'Add 5', and it checks out across every single pair!", style: 'statement' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Sprocket led them to a grander contraption with two interlocking gears.", style: 'statement' },
  { text: "Some machines use compound rules — two actions in a chain! For example, double the number, then subtract 3.", style: 'statement' },
  { text: "Nurul watched in awe: 5 doubled is 10, minus 3 gives 7. Then 7 doubled is 14, minus 3 gives 11!", style: 'statement' },
  { text: "Now for the master trick, whispered Sprocket. To run a compound machine in reverse, you must do two things: swap every operation for its opposite, AND reverse the order they run in!", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "At the centre of the workshop stood the oldest machine of all, its starting dial locked. Its 3rd term read 17, and its rule was 'double, then add 1.'", style: 'statement' },
  { text: "Let's work backwards to find where it began! Zhi Hao said. The reverse rule is: subtract 1, then halve!", style: 'statement' },
  { text: "Nurul took the controls: 17 minus 1 is 16, halved gives 8. Then 8 minus 1 is 7... wait! Term 1 was 3!", style: 'statement' },
  { text: "The brass dial clicked into place, spinning smoothly. You've mastered the sequence machine! Sprocket cheered.", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — The Sequence Machine Lab!", style: 'instruction' },
  { text: "Set your starting input number and pick your operation gears to see numbers flow through the machine and generate a live sequence!", style: 'instruction' },
  { text: "Welcome to Station B — Calibrate the Machine!", style: 'instruction' },
  { text: "Tune the machine's gears and operation values using the plus and minus controls to match the target sequence!", style: 'instruction' },
  { text: "Welcome to Station C — Reverse Engineer the Machine!", style: 'instruction' },
  { text: "Inspect the jammed machine's later terms, test candidate operations across consecutive pairs, and step backwards to recover Term 1!", style: 'instruction' },
  { text: "Welcome to Station D — Spot the Broken Gear!", style: 'instruction' },
  { text: "Inspect the apprentice's working log, tap the line with the flaw, and select the correct repair!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That gear turned perfectly! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are in top gear! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, test every pair, and try again! 💡", style: 'thinking' },
  { text: "Here's your first hint! Look at the transition between consecutive terms.", style: 'encouragement' },
  { text: "Here's your final clue! Remember that a term-to-term rule is an action, not a starting number.", style: 'encouragement' },

  // ─── DISTRICT & BOSS BATTLES ─────────────────────────────────────────────
  { text: "World Complete! Spectacular job on this workshop machine world! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Repair the malfunctioning machine by answering every question correctly!", style: 'emphasis' },
  { text: "Victory! You repaired the rogue machine and claimed your Workshop Badge! 🛠️", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the golden rules of term-to-term sequences and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered term-to-term rules, compound machines, and reverse engineering! You are a Chief Engineer! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      continue;
    }

    if (!apiKey) continue;

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in RuleQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
}

main().catch(console.error);
