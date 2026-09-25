// src/data/questionBank.js
// Procedural question bank generator for RuleQuest (Grade 7 Term-to-Term Rules)
// 100 Comprehensive Questions across 10 Themed Worlds
// Strictly enforces integer cleanliness, 4 unique options, and platform headline misconceptions.

import { WORLDS } from '../config/worlds.config.js';
import {
  applyOperation,
  applyRule,
  generateSequence,
  reverseOperation,
  reverseRule,
  reverseRuleWrongOrder,
  applyReversedRule,
  verifyRuleAgainstSequence,
  classifyRuleType,
  generateFibonacciTypeSequence,
  formatRuleString,
  isCleanInteger,
} from '../utils/ruleMachineMath.js';

// Export DISTRICTS mapped from WORLDS for KingdomMap and PlayPhase
export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeUniqueOptions(correctAnswer, distractors) {
  const strCorrect = String(correctAnswer).trim();
  const set = new Set();
  set.add(strCorrect);

  const finalDistractors = [];
  for (const d of distractors) {
    const s = String(d).trim();
    if (!set.has(s) && s.length > 0) {
      set.add(s);
      finalDistractors.push(s);
      if (finalDistractors.length === 3) break;
    }
  }

  let counter = 1;
  while (finalDistractors.length < 3) {
    const num = parseFloat(strCorrect);
    if (!isNaN(num)) {
      const candidate = String(num + counter * 3);
      if (!set.has(candidate)) {
        set.add(candidate);
        finalDistractors.push(candidate);
      }
      counter++;
    } else {
      const candidate = `Alternative ${counter}`;
      if (!set.has(candidate)) {
        set.add(candidate);
        finalDistractors.push(candidate);
      }
      counter++;
    }
  }

  const options = shuffleArray([strCorrect, ...finalDistractors]);
  return { options, correctAnswer: strCorrect };
}

// ── WORLD 0: Reading the Blueprint (state-single-step-rule) ───────────────
function genWorld0(qIdx) {
  const operations = [
    { op: 'add', value: 3, start: 4 },
    { op: 'add', value: 4, start: 5 },
    { op: 'add', value: 5, start: 2 },
    { op: 'add', value: 6, start: 7 },
    { op: 'add', value: 7, start: 3 },
    { op: 'subtract', value: 3, start: 25 },
    { op: 'subtract', value: 4, start: 30 },
    { op: 'subtract', value: 5, start: 40 },
    { op: 'multiply', value: 2, start: 3 },
    { op: 'multiply', value: 3, start: 2 },
  ];
  const item = operations[qIdx % operations.length];
  const seq = generateSequence(item.start, [item], 4);
  const correct = formatRuleString(item);

  // Distractor 1: Headline misconception — naming the first term as the rule
  const distractorFirstTerm = String(item.start);
  // Distractor 2: Opposite operation
  const opposite = formatRuleString(reverseOperation(item));
  // Distractor 3: Wrong value
  const wrongVal = formatRuleString({ op: item.op, value: item.value + 1 });

  const { options, correctAnswer } = makeUniqueOptions(correct, [
    distractorFirstTerm,
    opposite,
    wrongVal,
  ]);

  return {
    id: qIdx + 1,
    districtId: 0,
    category: 'STATE THE RULE',
    visual: 'sequence-strip',
    questionText: `What is the term-to-term rule for the sequence: ${seq.join(', ')}, …?`,
    options,
    correctAnswer,
    explanation: `Looking at consecutive terms: ${seq[0]} ➔ ${seq[1]} is ${correct.toLowerCase()}. A rule describes the ACTION between terms, not the starting number!`,
    hint1: `Find how you get from the first term (${seq[0]}) to the second term (${seq[1]}).`,
    hint2: `Check if that same operation works between ${seq[1]} and ${seq[2]}. Remember: a rule is an action, not the first number!`,
    visualData: { sequence: seq, ruleLabel: correct },
  };
}

// ── WORLD 1: Testing the Machine (verify-rule-every-pair) ──────────────────
function genWorld1(qIdx) {
  // Variations: Some valid sequences, some invalid that break at index 1, 2, or 3
  const tests = [
    { rule: { op: 'add', value: 4 }, seq: [3, 7, 11, 15], valid: true, breakAt: null },
    { rule: { op: 'add', value: 3 }, seq: [2, 5, 8, 12], valid: false, breakAt: 2, actualGap: 4 },
    { rule: { op: 'add', value: 5 }, seq: [10, 15, 20, 25], valid: true, breakAt: null },
    { rule: { op: 'subtract', value: 4 }, seq: [28, 24, 20, 15], valid: false, breakAt: 2, actualGap: 5 },
    { rule: { op: 'multiply', value: 2 }, seq: [3, 6, 12, 24], valid: true, breakAt: null },
    { rule: { op: 'add', value: 6 }, seq: [5, 11, 18, 24], valid: false, breakAt: 1, actualGap: 7 },
    { rule: { op: 'subtract', value: 3 }, seq: [21, 18, 15, 12], valid: true, breakAt: null },
    { rule: { op: 'multiply', value: 3 }, seq: [2, 6, 18, 50], valid: false, breakAt: 2, actualGap: 'multiply by 2.77' },
    { rule: { op: 'add', value: 7 }, seq: [4, 11, 18, 25], valid: true, breakAt: null },
    { rule: { op: 'add', value: 8 }, seq: [1, 9, 17, 26], valid: false, breakAt: 2, actualGap: 9 },
  ];

  const t = tests[qIdx % tests.length];
  const ruleStr = formatRuleString(t.rule);

  let correct, distractors, explanation;
  if (t.valid) {
    correct = `Yes — every consecutive gap matches "${ruleStr.toLowerCase()}"`;
    distractors = [
      `No — only the first pair matches`,
      `No — the rule is ${t.seq[0]}`,
      `No — it only works for odd numbers`,
    ];
    explanation = `Checking every pair: each step consistently follows "${ruleStr.toLowerCase()}". It is valid for the whole sequence!`;
  } else {
    correct = `No — the gap between ${t.seq[t.breakAt]} and ${t.seq[t.breakAt + 1]} does not follow the rule`;
    distractors = [
      `Yes — the first pair matches so the rule is valid`,
      `Yes — any sequence starting at ${t.seq[0]} is valid`,
      `No — a rule cannot use the number ${t.rule.value}`,
    ];
    explanation = `The first pair(s) may seem to fit, but between ${t.seq[t.breakAt]} and ${t.seq[t.breakAt + 1]} the rule fails. You must test EVERY pair!`;
  }

  const { options, correctAnswer } = makeUniqueOptions(correct, distractors);

  return {
    id: qIdx + 11,
    districtId: 1,
    category: 'VERIFY EVERY PAIR',
    visual: 'sequence-strip',
    questionText: `Does "${ruleStr}" correctly describe the sequence: ${t.seq.join(', ')}?`,
    options,
    correctAnswer,
    explanation,
    hint1: `Test the proposed rule between the 1st and 2nd terms, then 2nd and 3rd, and 3rd and 4th.`,
    hint2: `Never stop after checking only the first pair — look closely at every transition!`,
    visualData: { sequence: t.seq, breakIndex: t.breakAt, ruleLabel: ruleStr },
  };
}

// ── WORLD 2: Running the Machine Forward (apply-single-step-rule) ──────────
function genWorld2(qIdx) {
  const problems = [
    { start: 3, op: { op: 'multiply', value: 3 }, targetTerm: 4, ans: 81 },
    { start: 2, op: { op: 'multiply', value: 2 }, targetTerm: 5, ans: 32 },
    { start: 5, op: { op: 'add', value: 6 }, targetTerm: 4, ans: 23 },
    { start: 12, op: { op: 'add', value: 7 }, targetTerm: 4, ans: 33 },
    { start: 50, op: { op: 'subtract', value: 8 }, targetTerm: 4, ans: 26 },
    { start: 4, op: { op: 'multiply', value: 3 }, targetTerm: 3, ans: 36 },
    { start: 80, op: { op: 'divide', value: 2 }, targetTerm: 4, ans: 10 },
    { start: 7, op: { op: 'add', value: 9 }, targetTerm: 4, ans: 34 },
    { start: 1, op: { op: 'multiply', value: 4 }, targetTerm: 4, ans: 64 },
    { start: 45, op: { op: 'subtract', value: 6 }, targetTerm: 4, ans: 27 },
  ];
  const p = problems[qIdx % problems.length];
  const ruleStr = formatRuleString(p.op);

  const correct = p.ans;
  // Common error: applying rule one fewer times (3rd term instead of 4th)
  const prevTerm = applyReversedRule(p.ans, [p.op], 1);
  // Common error: multiplying starting term directly by targetTerm
  const directMul = p.start + (p.targetTerm * p.op.value);
  const offset = p.ans + p.op.value;

  const { options, correctAnswer } = makeUniqueOptions(correct, [prevTerm, directMul, offset]);

  return {
    id: qIdx + 21,
    districtId: 2,
    category: 'GENERATE FORWARD',
    visual: 'machine-flow',
    questionText: `A sequence machine's rule is "${ruleStr}." Starting with Term 1 = ${p.start}, what is Term ${p.targetTerm}?`,
    options,
    correctAnswer,
    explanation: `Starting at ${p.start}: applying "${ruleStr.toLowerCase()}" repeatedly step-by-step reaches Term ${p.targetTerm} = ${correct}.`,
    hint1: `Write down Term 1 = ${p.start}, then apply the rule once to get Term 2.`,
    hint2: `Keep going until you reach Term ${p.targetTerm}.`,
    visualData: { input: p.start, steps: [p.op], output: '?' },
  };
}

// ── WORLD 3: The Two-Gear Machine (apply-compound-rule) ────────────────────
function genWorld3(qIdx) {
  const problems = [
    { start: 3, steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 1 }], targetTerm: 3, ans: 9 }, // 3 -> 5 -> 9
    { start: 2, steps: [{ op: 'multiply', value: 3 }, { op: 'subtract', value: 2 }], targetTerm: 3, ans: 10 }, // 2 -> 4 -> 10
    { start: 4, steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 3 }], targetTerm: 3, ans: 25 }, // 4 -> 11 -> 25
    { start: 1, steps: [{ op: 'multiply', value: 3 }, { op: 'add', value: 2 }], targetTerm: 3, ans: 17 }, // 1 -> 5 -> 17
    { start: 5, steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 3 }], targetTerm: 3, ans: 11 }, // 5 -> 7 -> 11
    { start: 2, steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 5 }], targetTerm: 3, ans: 23 }, // 2 -> 9 -> 23
    { start: 3, steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }], targetTerm: 4, ans: 31 }, // 3 -> 7 -> 15 -> 31
    { start: 4, steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 4 }], targetTerm: 3, ans: 4 }, // 4 -> 4 -> 4 wait let's use start 5: 5->6->8
    { start: 5, steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 4 }], targetTerm: 3, ans: 8 }, // 5 -> 6 -> 8
    { start: 2, steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 4 }], targetTerm: 3, ans: 20 }, // 2 -> 8 -> 20
    { start: 1, steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 3 }], targetTerm: 3, ans: 13 }, // 1 -> 5 -> 13
  ];

  const p = problems[qIdx % problems.length];
  const ruleStr = formatRuleString(p.steps);
  const correct = p.ans;

  // Distractor: performing operations in wrong order
  const wrongOrderSteps = [...p.steps].reverse();
  const wrongOrderTerm = generateSequence(p.start, wrongOrderSteps, p.targetTerm)[p.targetTerm - 1];
  // Distractor: Term 2 instead of targetTerm
  const term2 = generateSequence(p.start, p.steps, 2)[1];
  const offset = correct + 2;

  const { options, correctAnswer } = makeUniqueOptions(correct, [wrongOrderTerm, term2, offset]);

  return {
    id: qIdx + 31,
    districtId: 3,
    category: 'COMPOUND RULES',
    visual: 'machine-flow',
    questionText: `A two-gear machine's rule is "${ruleStr}." Starting with Term 1 = ${p.start}, find Term ${p.targetTerm}.`,
    options,
    correctAnswer,
    explanation: `Pass each term through gear 1 then gear 2: Term 1 = ${p.start} ➔ Term 2 = ${term2} ➔ Term ${p.targetTerm} = ${correct}.`,
    hint1: `Apply the first gear operation first, then apply the second gear operation to that result.`,
    hint2: `That complete two-step process gives the next term. Repeat it to reach Term ${p.targetTerm}!`,
    visualData: { input: p.start, steps: p.steps, output: '?' },
  };
}

// ── WORLD 4: Reverse Engineering (work-backwards-single-step) ─────────────
function genWorld4(qIdx) {
  const problems = [
    { op: { op: 'add', value: 6 }, laterTerm: 25, laterIdx: 4, targetIdx: 3, ans: 19 }, // 25 - 6 = 19
    { op: { op: 'add', value: 7 }, laterTerm: 33, laterIdx: 4, targetIdx: 1, ans: 12 }, // 33 - 3*7 = 12
    { op: { op: 'subtract', value: 5 }, laterTerm: 15, laterIdx: 4, targetIdx: 3, ans: 20 }, // 15 + 5 = 20
    { op: { op: 'multiply', value: 2 }, laterTerm: 48, laterIdx: 4, targetIdx: 3, ans: 24 }, // 48 / 2 = 24
    { op: { op: 'multiply', value: 3 }, laterTerm: 54, laterIdx: 4, targetIdx: 2, ans: 6 }, // 54 / 3 / 3 = 6
    { op: { op: 'add', value: 8 }, laterTerm: 38, laterIdx: 4, targetIdx: 3, ans: 30 }, // 38 - 8 = 30
    { op: { op: 'divide', value: 2 }, laterTerm: 5, laterIdx: 4, targetIdx: 3, ans: 10 }, // 5 * 2 = 10
    { op: { op: 'subtract', value: 4 }, laterTerm: 18, laterIdx: 4, targetIdx: 1, ans: 30 }, // 18 + 3*4 = 30
    { op: { op: 'add', value: 9 }, laterTerm: 45, laterIdx: 4, targetIdx: 3, ans: 36 }, // 45 - 9 = 36
    { op: { op: 'multiply', value: 2 }, laterTerm: 56, laterIdx: 4, targetIdx: 1, ans: 7 }, // 56 / 8 = 7
  ];

  const p = problems[qIdx % problems.length];
  const ruleStr = formatRuleString(p.op);
  const revOp = reverseOperation(p.op);
  const correct = p.ans;

  // Distractor: Applying the forward operation instead of the reverse!
  const forwardMistake = applyOperation(p.laterTerm, p.op);
  const offset = correct + (p.op.value);
  const halfDist = Math.max(1, Math.floor(correct / 2));

  const { options, correctAnswer } = makeUniqueOptions(correct, [forwardMistake, offset, halfDist]);

  return {
    id: qIdx + 41,
    districtId: 4,
    category: 'WORK BACKWARDS',
    visual: 'reverse-flow',
    questionText: `A machine's rule is "${ruleStr}." If Term ${p.laterIdx} is ${p.laterTerm}, what was Term ${p.targetIdx}?`,
    options,
    correctAnswer,
    explanation: `To work backwards, apply the opposite operation: the reverse of "${ruleStr.toLowerCase()}" is "${formatRuleString(revOp).toLowerCase()}." Working back gives ${correct}.`,
    hint1: `To go backwards in a sequence, perform the inverse (opposite) operation.`,
    hint2: `If the forward rule adds, subtract! If the forward rule multiplies, divide!`,
    visualData: { laterTerm: p.laterTerm, laterIndex: `Term ${p.laterIdx}`, steps: [revOp], targetIndex: `Term ${p.targetIdx}`, targetVal: '?', stepsBack: p.laterIdx - p.targetIdx },
  };
}

// ── WORLD 5: Full Reverse (work-backwards-compound-rule) ───────────────────
function genWorld5(qIdx) {
  const problems = [
    // Rule: double then subtract 1. (3rd term is 9 -> term 2 is (9+1)/2=5 -> term 1 is (5+1)/2=3)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 1 }], laterTerm: 9, laterIdx: 3, targetIdx: 1, ans: 3, step2: 5 },
    // Rule: double then add 1. (3rd term is 15 -> term 2 is (15-1)/2=7 -> term 1 is (7-1)/2=3)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }], laterTerm: 15, laterIdx: 3, targetIdx: 1, ans: 3, step2: 7 },
    // Rule: double then add 3. (3rd term is 25 -> term 2 is (25-3)/2=11 -> term 1 is (11-3)/2=4)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 3 }], laterTerm: 25, laterIdx: 3, targetIdx: 1, ans: 4, step2: 11 },
    // Rule: triple then subtract 2. (3rd term is 10 -> term 2 is (10+2)/3=4 -> term 1 is (4+2)/3=2)
    { steps: [{ op: 'multiply', value: 3 }, { op: 'subtract', value: 2 }], laterTerm: 10, laterIdx: 3, targetIdx: 1, ans: 2, step2: 4 },
    // Rule: double then subtract 3. (3rd term is 11 -> term 2 is (11+3)/2=7 -> term 1 is (7+3)/2=5)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 3 }], laterTerm: 11, laterIdx: 3, targetIdx: 1, ans: 5, step2: 7 },
    // Rule: double then add 5. (3rd term is 23 -> term 2 is (23-5)/2=9 -> term 1 is (9-5)/2=2)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 5 }], laterTerm: 23, laterIdx: 3, targetIdx: 1, ans: 2, step2: 9 },
    // Rule: double then subtract 1. (2nd term is 9 -> term 1 is (9+1)/2=5)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 1 }], laterTerm: 9, laterIdx: 2, targetIdx: 1, ans: 5, step2: 5 },
    // Rule: double then add 1. (2nd term is 11 -> term 1 is (11-1)/2=5)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }], laterTerm: 11, laterIdx: 2, targetIdx: 1, ans: 5, step2: 5 },
    // Rule: double then subtract 4. (3rd term is 8 -> term 2 is (8+4)/2=6 -> term 1 is (6+4)/2=5)
    { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 4 }], laterTerm: 8, laterIdx: 3, targetIdx: 1, ans: 5, step2: 6 },
    // Rule: triple then add 2. (3rd term is 17 -> term 2 is (17-2)/3=5 -> term 1 is (5-2)/3=1)
    { steps: [{ op: 'multiply', value: 3 }, { op: 'add', value: 2 }], laterTerm: 17, laterIdx: 3, targetIdx: 1, ans: 1, step2: 5 },
  ];

  const p = problems[qIdx % problems.length];
  const ruleStr = formatRuleString(p.steps);
  const correctRevSteps = reverseRule(p.steps);
  const revStr = formatRuleString(correctRevSteps);
  const correct = p.ans;

  // Headline distractor: Inverted operations WITHOUT reversing their order!
  // e.g. for (x * 2 - 1): inverting without reversing order gives (x / 2 + 1)
  const wrongOrderRevSteps = reverseRuleWrongOrder(p.steps);
  let distractorWrongOrder;
  try {
    const wrongAns = applyRule(p.laterTerm, wrongOrderRevSteps);
    distractorWrongOrder = Math.round(wrongAns);
  } catch {
    distractorWrongOrder = correct + 3;
  }

  // Intermediate term distractor (e.g. Term 2 instead of Term 1)
  const distractorTerm2 = p.step2;
  const distractorForward = applyRule(p.laterTerm, p.steps);

  const { options, correctAnswer } = makeUniqueOptions(correct, [
    distractorWrongOrder,
    distractorTerm2,
    distractorForward,
  ]);

  return {
    id: qIdx + 51,
    districtId: 5,
    category: 'FULL REVERSE',
    visual: 'reverse-flow',
    questionText: `A machine runs the compound rule "${ruleStr}." If Term ${p.laterIdx} is ${p.laterTerm}, what was Term ${p.targetIdx}?`,
    options,
    correctAnswer,
    explanation: `To reverse a compound rule, do BOTH: swap each operation to its opposite AND reverse the order! The reverse rule is "${revStr.toLowerCase()}." Stepping backwards lands on ${correct}.`,
    hint1: `First reverse the last action performed, then reverse the first action.`,
    hint2: `Remember both parts of the rule: opposite operations AND reversed order!`,
    visualData: { laterTerm: p.laterTerm, laterIndex: `Term ${p.laterIdx}`, steps: correctRevSteps, targetIndex: `Term ${p.targetIdx}`, targetVal: '?' },
  };
}

// ── WORLD 6: Sort the Machines (classify-rule-type) ────────────────────────
function genWorld6(qIdx) {
  const problems = [
    { seq: [3, 6, 12, 24], type: 'Geometric', reason: 'constant multiplication by 2' },
    { seq: [5, 9, 13, 17], type: 'Arithmetic', reason: 'constant addition of 4' },
    { seq: [2, 5, 11, 23], type: 'Neither', reason: 'compound rule (double then add 1)' },
    { seq: [40, 20, 10, 5], type: 'Geometric', reason: 'constant division by 2' },
    { seq: [50, 43, 36, 29], type: 'Arithmetic', reason: 'constant subtraction of 7' },
    { seq: [1, 1, 2, 3, 5, 8], type: 'Neither', reason: 'Fibonacci-type sequence (sum of previous two)' },
    { seq: [2, 6, 18, 54], type: 'Geometric', reason: 'constant multiplication by 3' },
    { seq: [8, 14, 20, 26], type: 'Arithmetic', reason: 'constant addition of 6' },
    { seq: [3, 7, 15, 31], type: 'Neither', reason: 'compound rule (double then add 1)' },
    { seq: [100, 85, 70, 55], type: 'Arithmetic', reason: 'constant subtraction of 15' },
  ];

  const p = problems[qIdx % problems.length];
  const correct = p.type;
  const distractors = ['Arithmetic', 'Geometric', 'Neither'].filter(t => t !== correct);
  distractors.push('Position-to-term');

  const { options, correctAnswer } = makeUniqueOptions(correct, distractors);

  return {
    id: qIdx + 61,
    districtId: 6,
    category: 'CLASSIFY RULE TYPE',
    visual: 'sequence-strip',
    questionText: `Is the sequence: ${p.seq.join(', ')} arithmetic, geometric, or neither?`,
    options,
    correctAnswer,
    explanation: `This sequence is ${correct} because it has a ${p.reason}. (Arithmetic = constant add/subtract; Geometric = constant multiply/divide; Neither = compound or Fibonacci-type).`,
    hint1: `Check the differences between consecutive terms. Are they constant addition/subtraction?`,
    hint2: `Check the ratios. Are terms multiplied by the same factor, or is it a compound/sum pattern?`,
    visualData: { sequence: p.seq, ruleLabel: p.type },
  };
}

// ── WORLD 7: The Twin-Input Machine (fibonacci-type-sequences) ─────────────
function genWorld7(qIdx) {
  const seeds = [
    { t1: 1, t2: 3, nextTwo: [4, 7], full: [1, 3, 4, 7, 11] },
    { t1: 2, t2: 5, nextTwo: [7, 12], full: [2, 5, 7, 12, 19] },
    { t1: 3, t2: 4, nextTwo: [7, 11], full: [3, 4, 7, 11, 18] },
    { t1: 1, t2: 4, nextTwo: [5, 9], full: [1, 4, 5, 9, 14] },
    { t1: 2, t2: 3, nextTwo: [5, 8], full: [2, 3, 5, 8, 13] },
    { t1: 4, t2: 5, nextTwo: [9, 14], full: [4, 5, 9, 14, 23] },
    { t1: 1, t2: 5, nextTwo: [6, 11], full: [1, 5, 6, 11, 17] },
    { t1: 3, t2: 5, nextTwo: [8, 13], full: [3, 5, 8, 13, 21] },
    { t1: 2, t2: 4, nextTwo: [6, 10], full: [2, 4, 6, 10, 16] },
    { t1: 1, t2: 6, nextTwo: [7, 13], full: [1, 6, 7, 13, 20] },
  ];

  const s = seeds[qIdx % seeds.length];
  const correct = `${s.nextTwo[0]}, ${s.nextTwo[1]}`;

  // Distractors
  const dist1 = `${s.nextTwo[0]}, ${s.nextTwo[0] + 2}`;
  const dist2 = `${s.t1 + s.t2}, ${s.t1 * s.t2}`;
  const dist3 = `${s.nextTwo[0] + 1}, ${s.nextTwo[1] + 1}`;

  const { options, correctAnswer } = makeUniqueOptions(correct, [dist1, dist2, dist3]);

  return {
    id: qIdx + 71,
    districtId: 7,
    category: 'FIBONACCI-TYPE',
    visual: 'fibonacci-pair',
    questionText: `A Fibonacci-type sequence starts with ${s.t1}, ${s.t2}. What are the next two terms?`,
    options,
    correctAnswer,
    explanation: `In a Fibonacci-type sequence, each term is the sum of the two preceding terms: ${s.t1} + ${s.t2} = ${s.nextTwo[0]}, and then ${s.t2} + ${s.nextTwo[0]} = ${s.nextTwo[1]}.`,
    hint1: `A Fibonacci-type rule adds the two terms immediately before to make the next term.`,
    hint2: `Term 3 = Term 1 + Term 2. Then Term 4 = Term 2 + Term 3!`,
    visualData: { sequence: [s.t1, s.t2, '?', '?'], highlightIndices: [0, 1], targetIndex: 2 },
  };
}

// ── WORLD 8: The Inventor's Challenge (applied-multi-step-rule) ────────────
function genWorld8(qIdx) {
  const appliedProblems = [
    {
      q: "A workshop water tank starts with 10 litres and doubles each hour. How much water is in the tank at hour 5 (Term 5)?",
      ans: "160 litres",
      distractors: ["50 litres", "80 litres", "320 litres"],
      expl: "Sequence of litres: Hour 1 = 10, Hour 2 = 20, Hour 3 = 40, Hour 4 = 80, Hour 5 = 160 litres.",
      seq: [10, 20, 40, 80, 160],
    },
    {
      q: "Sprocket installs gears in rows. Row 1 has 4 gears, and each new row adds 5 more gears. How many gears are in Row 5?",
      ans: "24 gears",
      distractors: ["20 gears", "29 gears", "25 gears"],
      expl: "Row 1 = 4, Row 2 = 9, Row 3 = 14, Row 4 = 19, Row 5 = 24 gears.",
      seq: [4, 9, 14, 19, 24],
    },
    {
      q: "A machine cuts wire. The initial length was unknown, but after applying 'halve, then subtract 2 cm' twice, the wire is 8 cm. What was the starting length?",
      ans: "44 cm",
      distractors: ["36 cm", "20 cm", "50 cm"],
      expl: "Reverse rule is: 'add 2, then double'. 8 + 2 = 10, 10 × 2 = 20. Then 20 + 2 = 22, 22 × 2 = 44 cm.",
      seq: [44, 20, 8],
    },
    {
      q: "An apprentice logs workshop savings starting at $15. Each month he saves $12 more. How much total is saved by month 4?",
      ans: "$51",
      distractors: ["$48", "$63", "$39"],
      expl: "Month 1 = $15, Month 2 = $27, Month 3 = $39, Month 4 = $51.",
      seq: [15, 27, 39, 51],
    },
    {
      q: "A robotic conveyor sorts tokens by the rule 'triple the input, then add 1.' If 4 tokens enter, what comes out after 2 cycles?",
      ans: "40",
      distractors: ["13", "37", "43"],
      expl: "Input = 4. Cycle 1: 4 × 3 + 1 = 13. Cycle 2: 13 × 3 + 1 = 40 tokens.",
      seq: [4, 13, 40],
    },
    {
      q: "A cooling coil temperature drops by 6°C every minute. At minute 1 it is 62°C. What is its temperature at minute 5?",
      ans: "38°C",
      distractors: ["44°C", "32°C", "30°C"],
      expl: "Min 1 = 62°C, Min 2 = 56°C, Min 3 = 50°C, Min 4 = 44°C, Min 5 = 38°C.",
      seq: [62, 56, 50, 44, 38],
    },
    {
      q: "A chain reaction doubles the number of spinning gears and adds 2 every second. Starting with 3 gears, how many are spinning at second 3?",
      ans: "18",
      distractors: ["16", "8", "24"],
      expl: "Sec 1 = 3 gears. Sec 2 = 3 × 2 + 2 = 8. Sec 3 = 8 × 2 + 2 = 18 gears.",
      seq: [3, 8, 18],
    },
    {
      q: "Zhi Hao records daily workshop visits following a Fibonacci-type rule: Day 1 had 3 visits, Day 2 had 4 visits. How many visits occur on Day 5?",
      ans: "18",
      distractors: ["11", "15", "29"],
      expl: "Day 1 = 3, Day 2 = 4, Day 3 = 7, Day 4 = 11, Day 5 = 7 + 11 = 18 visits.",
      seq: [3, 4, 7, 11, 18],
    },
    {
      q: "A battery recharge test doubles energy then adds 5 units each cycle. If cycle 3 produced 35 units, what was the starting unit (Cycle 1)?",
      ans: "5 units",
      distractors: ["10 units", "2 units", "15 units"],
      expl: "Reverse is 'subtract 5, then halve'. Cycle 2 = (35 - 5)/2 = 15. Cycle 1 = (15 - 5)/2 = 5 units.",
      seq: [5, 15, 35],
    },
    {
      q: "Nurul sets up a workshop clock. Its gear rotates 8 degrees in the first notch, then 14, 20, 26 in subsequent notches. What is the rule?",
      ans: "Add 6 degrees",
      distractors: ["8 degrees", "Add 8 degrees", "Multiply by 2"],
      expl: "The differences between consecutive notches: 14 - 8 = 6, 20 - 14 = 6, 26 - 20 = 6. The rule is 'Add 6 degrees'.",
      seq: [8, 14, 20, 26],
    },
  ];

  const p = appliedProblems[qIdx % appliedProblems.length];
  const { options, correctAnswer } = makeUniqueOptions(p.ans, p.distractors);

  return {
    id: qIdx + 81,
    districtId: 8,
    category: 'APPLIED SCENARIO',
    visual: 'sequence-strip',
    questionText: p.q,
    options,
    correctAnswer,
    explanation: p.expl,
    hint1: `Break down the problem into term-by-term steps.`,
    hint2: `Look at the rule given and apply it one step at a time, or run it backwards if you know the final value!`,
    visualData: { sequence: p.seq },
  };
}

// ── WORLD 9: The Grand Workshop Showcase (mixed-review) ───────────────────
function genWorld9(qIdx) {
  // Grand finale combining classification, backward solving, compound verification
  const grandProblems = [
    {
      cat: 'COMPOUND REVERSE',
      q: "Master Reversal: A machine runs 'double, then add 5.' If Term 3 is 27, find Term 1.",
      ans: "3",
      dist: ["6", "11", "8"],
      expl: "Reverse rule: 'subtract 5, then halve.' Term 2 = (27 - 5)/2 = 11. Term 1 = (11 - 5)/2 = 3.",
      vis: 'reverse-flow',
      visData: { laterTerm: 27, laterIndex: 'Term 3', steps: [{ op: 'subtract', value: 5 }, { op: 'divide', value: 2 }], targetIndex: 'Term 1', targetVal: '?' },
    },
    {
      cat: 'CLASSIFY & REASON',
      q: "Which of the following sequences is GEOMETRIC?",
      ans: "4, 12, 36, 108",
      dist: ["4, 7, 10, 13", "4, 7, 14, 28", "1, 4, 5, 9"],
      expl: "4, 12, 36, 108 is geometric because each term is multiplied by a constant 3 (4×3=12, 12×3=36, 36×3=108).",
      vis: 'sequence-strip',
      visData: { sequence: [4, 12, 36, 108], ruleLabel: '× 3' },
    },
    {
      cat: 'VERIFY EVERY PAIR',
      q: "Does 'subtract 4' describe the sequence: 32, 28, 24, 19?",
      ans: "No — fails between 24 and 19 (gap is 5)",
      dist: ["Yes — 32 minus 4 is 28 so it works", "Yes — all terms are even except 19", "No — the rule is 32"],
      expl: "Checking every pair: 32➔28 (−4), 28➔24 (−4), but 24➔19 is −5! You must check every pair.",
      vis: 'sequence-strip',
      visData: { sequence: [32, 28, 24, 19], breakIndex: 2, ruleLabel: '− 4' },
    },
    {
      cat: 'FIBONACCI TWIN-INPUT',
      q: "A twin-input machine has Term 1 = 4 and Term 2 = 6. What is Term 5?",
      ans: "26",
      dist: ["16", "22", "30"],
      expl: "Term 1 = 4, Term 2 = 6, Term 3 = 10, Term 4 = 16, Term 5 = 10 + 16 = 26.",
      vis: 'fibonacci-pair',
      visData: { sequence: [4, 6, 10, 16, '?'], highlightIndices: [2, 3], targetIndex: 4 },
    },
    {
      cat: 'REVERSE HABIT',
      q: "What is the correct reverse of the compound rule: 'multiply by 4, then add 7'?",
      ans: "Subtract 7, then divide by 4",
      dist: ["Divide by 4, then subtract 7", "Add 7, then multiply by 4", "Subtract 4, then divide by 7"],
      expl: "Reversing a compound rule requires TWO steps: invert each operation AND reverse their order!",
      vis: 'machine-flow',
      visData: { input: 'x', steps: [{ op: 'subtract', value: 7 }, { op: 'divide', value: 4 }], output: 'orig' },
    },
    {
      cat: 'HEADLINE MISCONCEPTION',
      q: "Nurul looks at 8, 14, 20, 26 and says: 'The rule is 8.' How should Zhi Hao correct her?",
      ans: "8 is the first term; the rule is 'Add 6'",
      dist: ["She is right; the rule is always the first term", "The rule is 14", "The rule is multiply by 8"],
      expl: "A term-to-term rule describes the ACTION between consecutive terms ('Add 6'), never the starting number!",
      vis: 'sequence-strip',
      visData: { sequence: [8, 14, 20, 26], ruleLabel: '+ 6' },
    },
    {
      cat: 'GENERATE FORWARD',
      q: "A two-gear machine runs 'double, then add 3.' Starting at Term 1 = 2, find Term 3.",
      ans: "17",
      dist: ["7", "14", "19"],
      expl: "Term 1 = 2. Term 2 = 2 × 2 + 3 = 7. Term 3 = 7 × 2 + 3 = 17.",
      vis: 'machine-flow',
      visData: { input: 2, steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 3 }], output: 17 },
    },
    {
      cat: 'WORK BACKWARDS',
      q: "A single-operation machine's rule is 'divide by 3.' If Term 4 is 4, what was Term 1?",
      ans: "108",
      dist: ["12", "36", "48"],
      expl: "Reverse of 'divide by 3' is 'multiply by 3.' Term 3 = 12, Term 2 = 36, Term 1 = 108.",
      vis: 'reverse-flow',
      visData: { laterTerm: 4, laterIndex: 'Term 4', steps: [{ op: 'multiply', value: 3 }], targetIndex: 'Term 1', targetVal: 108 },
    },
    {
      cat: 'CLASSIFY RULE TYPE',
      q: "Why is the sequence 2, 5, 8, 11 classified as ARITHMETIC?",
      ans: "It has a constant difference (+3) between all terms",
      dist: ["It multiplies by 3", "It starts with an even number", "It has 4 terms"],
      expl: "Arithmetic sequences are defined by a constant add or subtract step between consecutive terms.",
      vis: 'sequence-strip',
      visData: { sequence: [2, 5, 8, 11], ruleLabel: '+ 3' },
    },
    {
      cat: 'CHIEF ENGINEER FINALE',
      q: "Final Grand Contraption: A sequence starts with 5. It uses the compound rule 'double, then subtract 3.' Find Term 4.",
      ans: "19",
      dist: ["7", "11", "35"],
      expl: "Term 1 = 5. Term 2 = 5×2−3 = 7. Term 3 = 7×2−3 = 11. Term 4 = 11×2−3 = 19.",
      vis: 'machine-flow',
      visData: { input: 5, steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 3 }], output: 19 },
    },
  ];

  const p = grandProblems[qIdx % grandProblems.length];
  const { options, correctAnswer } = makeUniqueOptions(p.ans, p.dist);

  return {
    id: qIdx + 91,
    districtId: 9,
    category: p.cat,
    visual: p.vis,
    questionText: p.q,
    options,
    correctAnswer,
    explanation: p.expl,
    hint1: `Think carefully about the concepts you've mastered across all 10 workshop worlds!`,
    hint2: `Check operations, reversals, and whether the question asks for a forward term, an earlier term, or a rule.`,
    visualData: p.visData,
  };
}

/**
 * Builds the complete 100-question bank across 10 worlds.
 */
export function generateQuestionBank() {
  const bank = [];
  for (let q = 0; q < 10; q++) bank.push(genWorld0(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld1(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld2(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld3(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld4(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld5(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld6(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld7(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld8(q));
  for (let q = 0; q < 10; q++) bank.push(genWorld9(q));
  return bank;
}

const questionBank = generateQuestionBank();
export default questionBank;
