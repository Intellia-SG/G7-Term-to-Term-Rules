// scripts/qa_audit.js
// Comprehensive QA Stress Test & Mathematical Correctness Audit for RuleQuest
// Strictly validates TRD §10.1, §10.2, §10.3, and §10.4

import { generateQuestionBank, DISTRICTS } from '../src/data/questionBank.js';
import {
  applyOperation,
  applyRule,
  reverseOperation,
  reverseRule,
  reverseRuleWrongOrder,
  applyReversedRule,
  verifyRuleAgainstSequence,
  classifyRuleType,
  isCleanInteger,
} from '../src/utils/ruleMachineMath.js';
import { audioMap } from '../src/utils/audioMap.js';
import * as narration from '../src/utils/narration.js';

console.log("=================================================");
console.log("🛠️  RULEQUEST COMPREHENSIVE QA & AUDIT SUITE");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAILED: ${message}`);
  }
}

// ── TEST 1: Question Bank Schema & Stress Test (300 generations) ──────────
console.log("🔍 Test 1: Question Bank Stress Test (300 generations = 30,000 questions)...");

let totalQuestionsAudited = 0;
for (let run = 0; run < 300; run++) {
  const bank = generateQuestionBank();
  assert(bank.length === 100, `Run ${run}: Expected 100 questions, got ${bank.length}`);

  bank.forEach((q, idx) => {
    totalQuestionsAudited++;

    // Schema validation
    assert(typeof q.id === 'number', `Q${idx} invalid id`);
    assert(typeof q.districtId === 'number' && q.districtId >= 0 && q.districtId <= 9, `Q${idx} invalid districtId`);
    assert(typeof q.category === 'string' && q.category.length > 0, `Q${idx} missing category`);
    assert(typeof q.questionText === 'string' && q.questionText.length > 0, `Q${idx} missing questionText`);
    assert(Array.isArray(q.options) && q.options.length === 4, `Q${idx} options length must be 4`);
    assert(q.options.includes(String(q.correctAnswer)), `Q${idx} options does not contain correctAnswer: "${q.correctAnswer}" vs [${q.options.join(', ')}]`);

    // No duplicate options
    const uniqueOpts = new Set(q.options);
    assert(uniqueOpts.size === 4, `Q${idx} has duplicate options: [${q.options.join(', ')}]`);

    // No NaN or undefined in options
    q.options.forEach(opt => {
      assert(!opt.includes('NaN'), `Q${idx} option contains NaN: ${opt}`);
      assert(!opt.includes('undefined'), `Q${idx} option contains undefined: ${opt}`);
      assert(!opt.includes('[object'), `Q${idx} option contains [object Object]: ${opt}`);
    });

    // Hints and explanations
    assert(typeof q.explanation === 'string' && q.explanation.length > 0, `Q${idx} missing explanation`);
    assert(typeof q.hint1 === 'string' && q.hint1.length > 0, `Q${idx} missing hint1`);
    assert(typeof q.hint2 === 'string' && q.hint2.length > 0, `Q${idx} missing hint2`);
  });
}
console.log(`✅ Passed 300 runs (${totalQuestionsAudited} questions validated)!`);

// ── TEST 2: Reverse-Arithmetic Correctness Audit (TRD §10.2) ──────────────
console.log("\n🔍 Test 2: Reverse-Arithmetic Correctness Audit (Module-Specific Risk)...");

const sampleBank = generateQuestionBank();

// Audit World 4 (work-backwards-single-step)
const w4Questions = sampleBank.filter(q => q.districtId === 4);
w4Questions.forEach(q => {
  const vis = q.visualData;
  const laterTerm = vis.laterTerm;
  const targetVal = parseInt(q.correctAnswer, 10);
  const revStep = vis.steps[0];
  const forwardStep = reverseOperation(revStep);

  // Independent forward verification: start at targetVal, walk forward stepsBack times, must land on laterTerm!
  const stepsBack = vis.stepsBack || 1;
  let forwardResult = targetVal;
  for (let s = 0; s < stepsBack; s++) {
    forwardResult = applyOperation(forwardResult, forwardStep);
  }
  assert(
    forwardResult === laterTerm,
    `World 4 Q${q.id}: Reverse arithmetic failed! Forward from ${targetVal} via ${stepsBack} step(s) of ${forwardStep.op} ${forwardStep.value} yielded ${forwardResult}, expected ${laterTerm}`
  );
  assert(isCleanInteger(targetVal), `World 4 Q${q.id}: targetVal is not a clean integer: ${targetVal}`);
});

// Audit World 5 (work-backwards-compound-rule)
const w5Questions = sampleBank.filter(q => q.districtId === 5);
w5Questions.forEach(q => {
  const vis = q.visualData;
  const laterTerm = vis.laterTerm;
  const targetVal = parseInt(q.correctAnswer, 10);
  const revSteps = vis.steps;
  const forwardSteps = reverseRule(revSteps);

  // Independent forward walk from targetVal
  const forwardResult = applyReversedRule(targetVal, revSteps, 1); // targetVal through forward steps
  // Or directly apply forward steps
  const directForward = applyRule(targetVal, forwardSteps);

  // For 2 steps back (from Term 3 to Term 1):
  if (vis.laterIndex.includes('3') && vis.targetIndex.includes('1')) {
    const t2 = applyRule(targetVal, forwardSteps);
    const t3 = applyRule(t2, forwardSteps);
    assert(
      t3 === laterTerm,
      `World 5 Q${q.id}: Independent 2-step forward walk failed! Starting ${targetVal} ➔ ${t2} ➔ ${t3}, expected ${laterTerm}`
    );
  } else if (vis.laterIndex.includes('2') && vis.targetIndex.includes('1')) {
    assert(
      directForward === laterTerm,
      `World 5 Q${q.id}: Independent 1-step forward walk failed! Starting ${targetVal} ➔ ${directForward}, expected ${laterTerm}`
    );
  }
  assert(isCleanInteger(targetVal), `World 5 Q${q.id}: targetVal is not a clean integer: ${targetVal}`);
});

console.log("✅ Reverse-arithmetic independent verification passed 100%!");

// ── TEST 3: Misconception Audit (TRD §10.3) ───────────────────────────────
console.log("\n🔍 Test 3: Misconception Audit...");

// Check that World 0 distractors contain the first term misconception
const w0 = sampleBank.filter(q => q.districtId === 0);
w0.forEach(q => {
  const firstTermStr = String(q.visualData.sequence[0]);
  assert(
    q.options.includes(firstTermStr),
    `World 0 Q${q.id}: Missing headline distractor (first term '${firstTermStr}') in options [${q.options.join(', ')}]`
  );
});

// Check that World 1 tests both valid and invalid sequences, and invalid sequences break beyond index 0
const w1 = sampleBank.filter(q => q.districtId === 1);
const invalidItems = w1.filter(q => q.visualData.breakIndex !== null);
const validItems = w1.filter(q => q.visualData.breakIndex === null);
assert(invalidItems.length > 0, "World 1 must contain invalid sequence tests");
assert(validItems.length > 0, "World 1 must contain valid sequence tests");
const breakIndices = new Set(invalidItems.map(q => q.visualData.breakIndex));
assert(breakIndices.has(1) || breakIndices.has(2), "World 1 breaks must include index 1 or 2 (testing beyond first pair)");

console.log("✅ Misconception audit passed!");

// ── TEST 4: Audio Parity Check (TRD §10.4) ────────────────────────────────
console.log("\n🔍 Test 4: Audio Parity Check...");

const wonderSegs = narration.wonderNarration();
wonderSegs.forEach(seg => {
  assert(audioMap[seg.text] !== undefined, `Audio mapping missing for wonder line: "${seg.text}"`);
});

for (let p = 0; p < 4; p++) {
  const storySegs = narration.storyNarration(p);
  storySegs.forEach(seg => {
    assert(audioMap[seg.text] !== undefined, `Audio mapping missing for story line: "${seg.text}"`);
  });
}

for (let s = 0; s < 4; s++) {
  const simSegs = narration.simStationIntro(s);
  simSegs.forEach(seg => {
    assert(audioMap[seg.text] !== undefined, `Audio mapping missing for sim station line: "${seg.text}"`);
  });
}

const reflectSegs = narration.reflectNarration();
reflectSegs.forEach(seg => {
  assert(audioMap[seg.text] !== undefined, `Audio mapping missing for reflect line: "${seg.text}"`);
});

console.log("✅ Audio parity check passed!");

// ── SUMMARY ───────────────────────────────────────────────────────────────
console.log("\n=================================================");
if (failed === 0) {
  console.log(`🎉 ALL ${passed} AUDIT CHECKS PASSED WITH ZERO ERRORS!`);
} else {
  console.error(`💥 AUDIT FAILED WITH ${failed} ERRORS (Passed: ${passed})`);
  process.exit(1);
}
console.log("=================================================\n");
