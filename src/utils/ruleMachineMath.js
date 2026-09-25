// src/utils/ruleMachineMath.js
// Core mathematics engine for RuleQuest (Grade 7 Term-to-Term Rules)
// Handles forward generation, algorithmic rule reversal, sequence verification,
// and rule-type classification with integer cleanliness guarantees.

/**
 * Apply a single mathematical operation to a term.
 * @param {number} term
 * @param {{ op: 'add'|'subtract'|'multiply'|'divide', value: number }} operation
 * @returns {number}
 */
export function applyOperation(term, operation) {
  if (!operation || typeof term !== 'number') return term;
  const { op, value } = operation;
  switch (op) {
    case 'add':
      return term + value;
    case 'subtract':
      return term - value;
    case 'multiply':
      return term * value;
    case 'divide':
      return value !== 0 ? term / value : term;
    default:
      return term;
  }
}

/**
 * Apply an ordered array of operations (1 or 2 steps) to a term.
 * @param {number} term
 * @param {Array<{ op: string, value: number }>} ruleSteps
 * @returns {number}
 */
export function applyRule(term, ruleSteps) {
  if (!Array.isArray(ruleSteps) || ruleSteps.length === 0) return term;
  return ruleSteps.reduce((curr, step) => applyOperation(curr, step), term);
}

/**
 * Returns the exact mathematical inverse of a single operation.
 * Single source of truth for operation reversal.
 * @param {{ op: string, value: number }} operation
 * @returns {{ op: string, value: number }}
 */
export function reverseOperation(operation) {
  const { op, value } = operation;
  switch (op) {
    case 'add':
      return { op: 'subtract', value };
    case 'subtract':
      return { op: 'add', value };
    case 'multiply':
      return { op: 'divide', value };
    case 'divide':
      return { op: 'multiply', value };
    default:
      return { ...operation };
  }
}

/**
 * Correctly reverses a compound rule:
 * 1. Inverts each operation (add ↔ subtract, multiply ↔ divide)
 * 2. Reverses the order of the steps
 * @param {Array<{ op: string, value: number }>} ruleSteps
 * @returns {Array<{ op: string, value: number }>}
 */
export function reverseRule(ruleSteps) {
  if (!Array.isArray(ruleSteps)) return [];
  return [...ruleSteps]
    .reverse()
    .map(reverseOperation);
}

/**
 * Deliberately buggy reversal that inverts operations WITHOUT reversing order.
 * Generates the platform headline misconception distractor per PRD §3 / TRD §4.4.
 * @param {Array<{ op: string, value: number }>} ruleSteps
 * @returns {Array<{ op: string, value: number }>}
 */
export function reverseRuleWrongOrder(ruleSteps) {
  if (!Array.isArray(ruleSteps)) return [];
  return ruleSteps.map(reverseOperation);
}

/**
 * Walk a later term backwards through reverseRule for stepsBack iterations.
 * @param {number} term - later term in sequence
 * @param {Array<{ op: string, value: number }>} ruleSteps - forward rule steps
 * @param {number} stepsBack - number of steps backwards
 * @returns {number}
 */
export function applyReversedRule(term, ruleSteps, stepsBack = 1) {
  const revSteps = reverseRule(ruleSteps);
  let curr = term;
  for (let i = 0; i < stepsBack; i++) {
    curr = applyRule(curr, revSteps);
  }
  return curr;
}

/**
 * Generate a sequence of given length starting at firstTerm using ruleSteps.
 * @param {number} firstTerm
 * @param {Array<{ op: string, value: number }>} ruleSteps
 * @param {number} length
 * @returns {number[]}
 */
export function generateSequence(firstTerm, ruleSteps, length = 4) {
  const seq = [firstTerm];
  let curr = firstTerm;
  for (let i = 1; i < length; i++) {
    curr = applyRule(curr, ruleSteps);
    seq.push(curr);
  }
  return seq;
}

/**
 * Verify whether a proposed rule holds for every consecutive pair in a sequence.
 * @param {number[]} sequence
 * @param {Array<{ op: string, value: number }>} ruleSteps
 * @returns {{ valid: boolean, failsAtIndex: number|null }}
 */
export function verifyRuleAgainstSequence(sequence, ruleSteps) {
  if (!sequence || sequence.length < 2) return { valid: true, failsAtIndex: null };
  for (let i = 0; i < sequence.length - 1; i++) {
    const expectedNext = applyRule(sequence[i], ruleSteps);
    if (expectedNext !== sequence[i + 1]) {
      return { valid: false, failsAtIndex: i };
    }
  }
  return { valid: true, failsAtIndex: null };
}

/**
 * Classify a sequence's rule type: 'arithmetic', 'geometric', or 'neither'.
 * @param {Array<{ op: string, value: number }>} ruleSteps
 * @returns {'arithmetic'|'geometric'|'neither'}
 */
export function classifyRuleType(ruleSteps) {
  if (!Array.isArray(ruleSteps) || ruleSteps.length !== 1) {
    return 'neither';
  }
  const op = ruleSteps[0].op;
  if (op === 'add' || op === 'subtract') return 'arithmetic';
  if (op === 'multiply' || op === 'divide') return 'geometric';
  return 'neither';
}

/**
 * Generate a Fibonacci-type sequence where each term = sum of previous two.
 * @param {number} term1
 * @param {number} term2
 * @param {number} length
 * @returns {number[]}
 */
export function generateFibonacciTypeSequence(term1 = 1, term2 = 2, length = 6) {
  const seq = [term1, term2];
  for (let i = 2; i < length; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

/**
 * Formats a rule step or steps into standard educational wording.
 * Never outputs a bare number!
 * @param {Array<{ op: string, value: number }>|{ op: string, value: number }} ruleSteps
 * @returns {string}
 */
export function formatRuleString(ruleSteps) {
  const steps = Array.isArray(ruleSteps) ? ruleSteps : [ruleSteps];
  if (steps.length === 0) return 'No action';

  const stepToWord = (step) => {
    switch (step.op) {
      case 'add':
        return `Add ${step.value}`;
      case 'subtract':
        return `Subtract ${step.value}`;
      case 'multiply':
        return step.value === 2 ? 'Double' : `Multiply by ${step.value}`;
      case 'divide':
        return step.value === 2 ? 'Halve' : `Divide by ${step.value}`;
      default:
        return `${step.op} ${step.value}`;
    }
  };

  if (steps.length === 1) {
    return stepToWord(steps[0]);
  }

  const first = stepToWord(steps[0]);
  const second = stepToWord(steps[1]).toLowerCase();
  return `${first}, then ${second}`;
}

/**
 * Curated single operations with clean numbers.
 */
export function pickSingleOperation(type = 'any') {
  const addSub = [
    { op: 'add', value: 2 },
    { op: 'add', value: 3 },
    { op: 'add', value: 4 },
    { op: 'add', value: 5 },
    { op: 'add', value: 6 },
    { op: 'add', value: 7 },
    { op: 'add', value: 8 },
    { op: 'add', value: 9 },
    { op: 'subtract', value: 2 },
    { op: 'subtract', value: 3 },
    { op: 'subtract', value: 4 },
    { op: 'subtract', value: 5 },
    { op: 'subtract', value: 6 },
  ];

  const mulDiv = [
    { op: 'multiply', value: 2 },
    { op: 'multiply', value: 3 },
    { op: 'multiply', value: 4 },
    { op: 'divide', value: 2 },
    { op: 'divide', value: 3 },
  ];

  let pool = [...addSub, ...mulDiv];
  if (type === 'arithmetic') pool = addSub;
  if (type === 'geometric') pool = mulDiv;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Curated compound rules that guarantee clean integers forward and backward.
 */
export const CURATED_COMPOUND_PRESETS = [
  { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }], startingTerms: [1, 2, 3, 4] },
  { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 1 }], startingTerms: [2, 3, 4, 5] },
  { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 3 }], startingTerms: [1, 2, 3] },
  { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 3 }], startingTerms: [3, 4, 5] },
  { steps: [{ op: 'multiply', value: 3 }, { op: 'subtract', value: 2 }], startingTerms: [1, 2, 3] },
  { steps: [{ op: 'multiply', value: 3 }, { op: 'add', value: 2 }], startingTerms: [1, 2] },
  { steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 5 }], startingTerms: [1, 2, 3] },
  { steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 4 }], startingTerms: [4, 5, 6] },
];

export function pickCompoundOperation() {
  const preset = CURATED_COMPOUND_PRESETS[Math.floor(Math.random() * CURATED_COMPOUND_PRESETS.length)];
  const startTerm = preset.startingTerms[Math.floor(Math.random() * preset.startingTerms.length)];
  return { steps: preset.steps, startTerm };
}

/**
 * Helper to ensure forward and reverse results are non-fractional integers.
 */
export function isCleanInteger(n) {
  return typeof n === 'number' && Number.isFinite(n) && Math.floor(n) === n;
}
