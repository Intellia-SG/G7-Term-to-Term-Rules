// src/components/simulations/CalibrateTheMachine.jsx
// Station B: Build-to-Target Challenge for RuleQuest (Grade 7 Term-to-Term Rules)
// Contract: <StationComponent onComplete={fn} audioEnabled={bool} />

import React, { useState } from 'react';
import './Stations.css';
import RuleMachineVisual from '../shared/RuleMachineVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { generateSequence, formatRuleString } from '../../utils/ruleMachineMath.js';

const TARGET_CHALLENGES = [
  {
    id: 1,
    title: 'Challenge 1: Linear Machine',
    start: 3,
    targetSeq: [3, 7, 11, 15],
    targetRuleStr: 'Add 4',
    hint: 'Try setting an addition operation on Gear 1!',
  },
  {
    id: 2,
    title: 'Challenge 2: Multiplier Gear',
    start: 2,
    targetSeq: [2, 6, 18, 54],
    targetRuleStr: 'Multiply by 3',
    hint: 'The numbers grow rapidly! Try a multiplication operation.',
  },
  {
    id: 3,
    title: 'Challenge 3: Two-Gear Compound Engine',
    start: 4,
    targetSeq: [4, 9, 19, 39],
    targetRuleStr: 'Double, then add 1',
    hint: 'Use two gears: multiply by 2 first, then add 1!',
  },
];

export default function CalibrateTheMachine({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [challIdx, setChallIdx] = useState(0);

  // Machine tuning controls
  const [gear1Op, setGear1Op] = useState('add');
  const [gear1Val, setGear1Val] = useState(2);
  const [gear2Active, setGear2Active] = useState(false);
  const [gear2Op, setGear2Op] = useState('add');
  const [gear2Val, setGear2Val] = useState(1);

  const [matchedOnce, setMatchedOnce] = useState(false);
  const [shake, setShake] = useState(false);

  const currentChall = TARGET_CHALLENGES[challIdx];

  // Current live rule and generated sequence
  const currentRuleSteps = [{ op: gear1Op, value: gear1Val }];
  if (gear2Active) {
    currentRuleSteps.push({ op: gear2Op, value: gear2Val });
  }

  const liveSeq = generateSequence(currentChall.start, currentRuleSteps, 4);

  // Check exact match
  const isMatch = liveSeq.every((val, i) => val === currentChall.targetSeq[i]);

  function adjustVal1(delta) {
    sounds.click();
    setGear1Val(v => Math.max(1, Math.min(10, v + delta)));
  }

  function adjustVal2(delta) {
    sounds.click();
    setGear2Val(v => Math.max(1, Math.min(10, v + delta)));
  }

  function handleCheck() {
    if (isMatch) {
      sounds.correct();
      setMatchedOnce(true);
      narrate([{ text: "Calibration locked in! The live output matches the target sequence perfectly!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setShake(true);
      narrate([{ text: "Not matching yet! Check the hint and adjust the operations or numbers.", style: 'thinking' }]);
      setTimeout(() => setShake(false), 600);
    }
  }

  function nextChallenge() {
    sounds.click();
    setChallIdx(idx => (idx + 1) % TARGET_CHALLENGES.length);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔧 Station B: Calibrate the Machine</h3>
        <div className="station-target-box">
          <span className="station-target-label">{currentChall.title}</span>
          <span className="station-target-num" style={{ fontSize: '0.95rem' }}>
            Target: {currentChall.targetSeq.join(', ')}
          </span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Calibration Dials */}
        <div className="station-col-left">
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">⚙️</span>
              <h4 className="panel-title">Gear 1 Dial</h4>
            </div>
            <div className="op-toggle-grid">
              {['add', 'subtract', 'multiply', 'divide'].map(op => (
                <button
                  key={op}
                  className={`op-select-btn ${gear1Op === op ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setGear1Op(op); }}
                >
                  {op === 'add' && '+ Add'}
                  {op === 'subtract' && '− Subtract'}
                  {op === 'multiply' && '× Multiply'}
                  {op === 'divide' && '÷ Divide'}
                </button>
              ))}
            </div>
            <div className="stepper-row compact-stepper">
              <span className="stepper-label">Value:</span>
              <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustVal1(-1)} disabled={gear1Val <= 1}>−</button>
              <span className="stepper-num">{gear1Val}</span>
              <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustVal1(1)} disabled={gear1Val >= 10}>+</button>
            </div>
          </div>

          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">⚙️</span>
              <h4 className="panel-title">Gear 2 Dial (Compound)</h4>
              <button
                className={`btn btn-sm ${gear2Active ? 'btn-primary' : 'btn-outline'}`}
                style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => { sounds.click(); setGear2Active(!gear2Active); }}
              >
                {gear2Active ? 'Gear 2 ON' : 'Gear 2 OFF'}
              </button>
            </div>

            {gear2Active && (
              <>
                <div className="op-toggle-grid">
                  {['add', 'subtract', 'multiply'].map(op => (
                    <button
                      key={op}
                      className={`op-select-btn ${gear2Op === op ? 'active' : ''}`}
                      onClick={() => { sounds.click(); setGear2Op(op); }}
                    >
                      {op === 'add' && '+ Add'}
                      {op === 'subtract' && '− Subtract'}
                      {op === 'multiply' && '× Multiply'}
                    </button>
                  ))}
                </div>
                <div className="stepper-row compact-stepper">
                  <span className="stepper-label">Value:</span>
                  <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustVal2(-1)} disabled={gear2Val <= 1}>−</button>
                  <span className="stepper-num">{gear2Val}</span>
                  <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustVal2(1)} disabled={gear2Val >= 10}>+</button>
                </div>
              </>
            )}
          </div>

          <div className="hint-pill">
            <span>💡 Hint: {currentChall.hint}</span>
          </div>
        </div>

        {/* Right Column: Target vs Live Output Comparison */}
        <div className="station-col-right">
          {/* Target Sequence */}
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">🎯</span>
              <h4 className="panel-title">Target Sequence (Fixed Goal)</h4>
            </div>
            <RuleMachineVisual
              type="sequence-strip"
              data={{ sequence: currentChall.targetSeq }}
              compact={true}
            />
          </div>

          {/* Live Calibrated Output */}
          <div className={`station-panel ${shake ? 'anim-shake' : ''}`}>
            <div className="panel-title-row">
              <span className="panel-badge">⚡</span>
              <h4 className="panel-title">Your Live Machine Output</h4>
              <span className={`match-status-badge ${isMatch ? 'match-exact' : 'no-match'}`}>
                {isMatch ? 'EXACT MATCH ✅' : 'NO MATCH ❌'}
              </span>
            </div>
            <RuleMachineVisual
              type="sequence-strip"
              data={{ sequence: liveSeq, ruleLabel: formatRuleString(currentRuleSteps) }}
              compact={true}
            />
          </div>

          {/* Action Row */}
          <div className="calibrate-actions-row">
            <button className="btn btn-primary btn-md" onClick={handleCheck}>
              Test Calibration 🔍
            </button>
            <button className="btn btn-outline btn-md" onClick={nextChallenge}>
              Try Next Target ➔
            </button>
          </div>

          {/* Completion CTA */}
          <div className="station-footer-actions">
            {matchedOnce ? (
              <button className="btn btn-green btn-lg w-full anim-pulse" onClick={onComplete}>
                Complete Station B ✓
              </button>
            ) : (
              <div className="completion-hint-text">
                Match the target sequence to calibrate the machine!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
