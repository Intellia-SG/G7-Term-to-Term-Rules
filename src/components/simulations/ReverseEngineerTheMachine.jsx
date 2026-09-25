// src/components/simulations/ReverseEngineerTheMachine.jsx
// Station C: Multi-Step / Composite Construction for RuleQuest (Grade 7 Term-to-Term Rules)
// Contract: <StationComponent onComplete={fn} audioEnabled={bool} />

import React, { useState } from 'react';
import './Stations.css';
import RuleMachineVisual from '../shared/RuleMachineVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import {
  reverseRule,
  applyRule,
  formatRuleString,
} from '../../utils/ruleMachineMath.js';

export default function ReverseEngineerTheMachine({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);

  // Jammed machine scenario:
  // Visible output log: Term 3 = 15, Term 4 = 31, Term 5 = 63
  // True forward rule: [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }]
  // Reverse rule: [{ op: 'subtract', value: 1 }, { op: 'divide', value: 2 }]
  // Original Term 1: 3
  const visibleLog = [
    { term: 3, val: 15 },
    { term: 4, val: 31 },
    { term: 5, val: 63 },
  ];

  const candidateRules = [
    {
      id: 'rule_add16',
      label: 'Add 16',
      steps: [{ op: 'add', value: 16 }],
      isCorrect: false,
      feedback: '15 + 16 = 31, but 31 + 16 = 47, which does NOT reach 63! Fails on pair 2.',
    },
    {
      id: 'rule_mul2_add1',
      label: 'Double, then add 1',
      steps: [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }],
      isCorrect: true,
      feedback: '15 × 2 + 1 = 31, and 31 × 2 + 1 = 63! Works across every consecutive pair!',
    },
    {
      id: 'rule_mul2_sub1',
      label: 'Double, then subtract 1',
      steps: [{ op: 'multiply', value: 2 }, { op: 'subtract', value: 1 }],
      isCorrect: false,
      feedback: '15 × 2 − 1 = 29, not 31. Fails immediately!',
    },
  ];

  // Stage 1: Identify Forward Rule
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [stage1Passed, setStage1Passed] = useState(false);
  const [stage1Feedback, setStage1Feedback] = useState('');

  // Stage 2: Reverse Engineering Walk-back
  // User selects the reverse rule and computes Term 1
  const [stepBackTerm2, setStepBackTerm2] = useState('');
  const [stepBackTerm1, setStepBackTerm1] = useState('');
  const [stage2Passed, setStage2Passed] = useState(false);
  const [stage2Error, setStage2Error] = useState('');

  function handleSelectCandidate(cand) {
    sounds.click();
    setSelectedRuleId(cand.id);
    setStage1Feedback(cand.feedback);

    if (cand.isCorrect) {
      sounds.correct();
      setStage1Passed(true);
      narrate([{ text: "Rule confirmed! Now, let's reverse-engineer the machine back to Term 1!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setStage1Passed(false);
      narrate([{ text: "That rule didn't hold for every pair. Test another candidate!", style: 'thinking' }]);
    }
  }

  function handleVerifyReverse() {
    const t2 = parseInt(stepBackTerm2, 10);
    const t1 = parseInt(stepBackTerm1, 10);

    // Correct: From Term 3 (15): (15 - 1) / 2 = 7 (Term 2)
    // From Term 2 (7): (7 - 1) / 2 = 3 (Term 1)
    if (t2 === 7 && t1 === 3) {
      sounds.correct();
      setStage2Passed(true);
      setStage2Error('');
      narrate([{ text: "Incredible engineering! You reversed each operation in reverse order and recovered starting Term 1 = 3!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setStage2Error('Check your calculations: reverse of (×2 then +1) is (−1 then ÷2). Start at 15: subtract 1, then halve!');
      narrate([{ text: "Not quite. Remember: first subtract 1, then halve the result.", style: 'thinking' }]);
    }
  }

  const forwardSteps = [{ op: 'multiply', value: 2 }, { op: 'add', value: 1 }];
  const reversedSteps = reverseRule(forwardSteps);

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔄 Station C: Reverse Engineer the Machine</h3>
        <div className="station-target-box">
          <span className="station-target-label">Jammed Machine Reading:</span>
          <span className="station-target-num" style={{ fontSize: '0.95rem' }}>
            T3: 15 ➔ T4: 31 ➔ T5: 63
          </span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Stage 1 - Find the Rule */}
        <div className="station-col-left">
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">Step 1</span>
              <h4 className="panel-title">Identify the Forward Rule</h4>
            </div>
            <p className="panel-subtext">
              Test candidate rules against <strong>every</strong> visible pair (15 ➔ 31 ➔ 63):
            </p>

            <div className="candidate-rules-list">
              {candidateRules.map(cand => (
                <button
                  key={cand.id}
                  className={`candidate-rule-btn ${selectedRuleId === cand.id ? (cand.isCorrect ? 'active-correct' : 'active-wrong') : ''}`}
                  onClick={() => handleSelectCandidate(cand)}
                >
                  <span className="cand-check">{selectedRuleId === cand.id ? (cand.isCorrect ? '✅' : '❌') : '⚙️'}</span>
                  <span className="cand-label">{cand.label}</span>
                </button>
              ))}
            </div>

            {stage1Feedback && (
              <div className={`feedback-note ${stage1Passed ? 'note-success' : 'note-error'}`}>
                {stage1Feedback}
              </div>
            )}
          </div>

          {/* Visual Aid */}
          <div className="station-panel">
            <h4 className="panel-title">Machine Mode</h4>
            {stage1Passed ? (
              <RuleMachineVisual
                type="reverse-flow"
                data={{
                  laterTerm: 15,
                  laterIndex: 'Term 3',
                  steps: reversedSteps,
                  targetIndex: 'Term 1',
                  targetVal: stage2Passed ? 3 : '?',
                }}
                compact={true}
              />
            ) : (
              <RuleMachineVisual
                type="sequence-strip"
                data={{
                  sequence: [15, 31, 63],
                  ruleLabel: 'Test Pair',
                }}
                compact={true}
              />
            )}
          </div>
        </div>

        {/* Right Column: Stage 2 - Walk Backwards */}
        <div className="station-col-right">
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">Step 2</span>
              <h4 className="panel-title">Run the Machine in Reverse</h4>
            </div>
            <p className="panel-subtext">
              Forward rule: <strong>Double, then add 1</strong>.<br />
              Reverse rule: <strong>Subtract 1, then halve (÷2)</strong>!
            </p>

            <div className="walkback-step-card">
              <div className="walkback-row">
                <span className="walkback-label">Term 3:</span>
                <span className="walkback-val">15</span>
              </div>

              <div className="walkback-input-group">
                <label className="walkback-field-label">
                  Step 1: Reverse back to <strong>Term 2</strong> ( (15 − 1) ÷ 2 ):
                </label>
                <input
                  type="number"
                  className="walkback-input"
                  placeholder="Enter Term 2"
                  value={stepBackTerm2}
                  onChange={(e) => setStepBackTerm2(e.target.value)}
                  disabled={!stage1Passed || stage2Passed}
                />
              </div>

              <div className="walkback-input-group">
                <label className="walkback-field-label">
                  Step 2: Reverse back to <strong>Term 1</strong> ( (Term 2 − 1) ÷ 2 ):
                </label>
                <input
                  type="number"
                  className="walkback-input"
                  placeholder="Enter Term 1"
                  value={stepBackTerm1}
                  onChange={(e) => setStepBackTerm1(e.target.value)}
                  disabled={!stage1Passed || stage2Passed}
                />
              </div>

              <button
                className="btn btn-primary btn-md"
                onClick={handleVerifyReverse}
                disabled={!stage1Passed || stage2Passed || !stepBackTerm1 || !stepBackTerm2}
              >
                Verify Starting Input 🔍
              </button>

              {stage2Error && <div className="feedback-note note-error">{stage2Error}</div>}
              {stage2Passed && (
                <div className="feedback-note note-success">
                  ✅ Term 1 recovered! Starting input was 3. (3×2+1=7 ➔ 7×2+1=15!)
                </div>
              )}
            </div>
          </div>

          {/* Completion CTA */}
          <div className="station-footer-actions">
            {stage2Passed ? (
              <button className="btn btn-green btn-lg w-full anim-pulse" onClick={onComplete}>
                Complete Station C ✓
              </button>
            ) : (
              <div className="completion-hint-text">
                Complete Step 1 and recover Term 1 to finish reverse-engineering!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
