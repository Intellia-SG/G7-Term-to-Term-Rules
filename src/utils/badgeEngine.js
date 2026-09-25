// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for RuleQuest (Grade 7 Term-to-Term Rules)

export const BADGES = [
  { id: 'first_coin',       icon: '⚙️',  label: 'First Gear Turned',     description: 'Turned your very first gear with a correct answer!' },
  { id: 'hot_streak',        icon: '🔧',  label: 'Smooth Running',        description: 'Achieved a streak of 5 correct answers!' },
  { id: 'super_streak',      icon: '🔥',  label: 'Well-Oiled Streak',     description: 'Achieved a 10-question winning streak!' },
  { id: 'change_champ',      icon: '🧰',  label: 'Full Toolbox',          description: 'Completed all 4 sequence machine stations!' },
  { id: 'district_champ',    icon: '⭐',  label: 'Machine Perfected',     description: 'Scored 3 stars in a workshop world!' },
  { id: 'boss_slayer',       icon: '🛠️',  label: 'Malfunction Fixed',     description: 'Fixed a jammed machine boss in battle!' },
  { id: 'century_scorer',    icon: '🔩',  label: 'Dedicated Tinkerer',    description: 'Answered over 20 questions in the workshop!' },
  { id: 'money_master',      icon: '🏆',  label: 'Master Inventor Badge', description: 'Completed the full 5-phase RuleQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_coin');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.maxStreak >= 10) unlocked.push('super_streak');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('change_champ');
  }

  // 3-star district check
  if (state.districtScores && state.districtScores.some(score => score !== null && score >= 9)) {
    unlocked.push('district_champ');
  }

  // Centurion
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('century_scorer');
  }

  // Boss slayer
  if (state.bossDefeated) {
    unlocked.push('boss_slayer');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('money_master');
  }

  return unlocked;
}
