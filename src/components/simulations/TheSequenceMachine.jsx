// src/components/simulations/TheSequenceMachine.jsx
// Station A: Concept Discovery Lab for RuleQuest (Grade 7 Term-to-Term Rules)
// Contract: <StationComponent onComplete={fn} audioEnabled={bool} />

import React, { useState } from 'react';
import './Stations.css';
import RuleMachineVisual from '../shared/RuleMachineVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { applyRule, generateSequence, formatRuleString } from '../../utils/ruleMachineMath.js';

export default function TheSequenceMachine({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);

  // Machine controls state
  const [startInput, setStartInput] = useState(3);
  const [gear1Op, setGear1Op] = useState('multiply');
  const [gear1Val, setGear1Val] = useState(2);
  const [gear2Active, setGear2Active] = useState(true);
  const [gear2Op, setGear2Op] = useState('add');
  const [gear2Val, setGear2Val] = useState(3);

  // Confirmation Question state (per PRD §8.3 & TRD §6)
  // "If the machine subtracts 3 then doubles, what comes out if you put in 5?" -> (5 - 3) * 2 = 4
  const [confAnswer, setConfAnswer] = useState(null);
  const [confPassed, setConfPassed] = useState(false);
  const [confShake, setConfShake] = useState(false);

  // Assemble active rule steps
  const ruleSteps = [{ op: gear1Op, value: gear1Val }];
  if (gear2Active) {
    ruleSteps.push({ op: gear2Op, value: gear2Val });
  }

  // Calculate live sequence
  const liveSequence = generateSequence(startInput, ruleSteps, 4);
  const ruleString = formatRuleString(ruleSteps);

  function adjustStart(delta) {
    sounds.click();
    setStartInput(prev => Math.max(1, Math.min(25, prev + delta)));
  }

  function adjustGear1Val(delta) {
    sounds.click();
    setGear1Val(prev => Math.max(1, Math.min(10, prev + delta)));
  }

  function adjustGear2Val(delta) {
    sounds.click();
    setGear2Val(prev => Math.max(1, Math.min(10, prev + delta)));
  }

  function handleConfSelect(opt) {
    setConfAnswer(opt);
    if (opt === 4) {
      setConfPassed(true);
      sounds.correct();
      narrate([{ text: "Spot on! 5 minus 3 is 2, and 2 doubled is 4! You've mastered how sequence machines work!", style: 'celebration' }]);
    } else {
      setConfShake(true);
      sounds.wrong();
      narrate([{ text: "Not quite. Remember: first subtract 3 from 5, then double that intermediate result!", style: 'thinking' }]);
      setTimeout(() => setConfShake(false), 600);
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">⚙️ Station A: The Sequence Machine Lab</h3>
        <div className="station-target-box">
          <span className="station-target-label">Current Rule:</span>
          <span className="station-target-num" style={{ fontSize: '1rem' }}>{ruleString}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Controls */}
        <div className="station-col-left">
          {/* Starting Input Controller */}
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">1</span>
              <h4 className="panel-title">Starting Number (Term 1)</h4>
            </div>
            <div className="stepper-row">
              <button
                className="btn btn-outline btn-sm stepper-btn"
                onClick={() => adjustStart(-1)}
                disabled={startInput <= 1}
                aria-label="Decrease start input"
              >
                −
              </button>
              <div className="stepper-display">
                <span className="stepper-num">{startInput}</span>
              </div>
              <button
                className="btn btn-outline btn-sm stepper-btn"
                onClick={() => adjustStart(1)}
                disabled={startInput >= 25}
                aria-label="Increase start input"
              >
                +
              </button>
            </div>
          </div>

          {/* Gear 1 Controller */}
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">2</span>
              <h4 className="panel-title">Gear 1 Operation</h4>
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
              <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustGear1Val(-1)} disabled={gear1Val <= 1}>−</button>
              <span className="stepper-num">{gear1Val}</span>
              <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustGear1Val(1)} disabled={gear1Val >= 10}>+</button>
            </div>
          </div>

          {/* Gear 2 Controller (Compound Rule) */}
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">3</span>
              <h4 className="panel-title">Gear 2 (Compound Step)</h4>
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
                  <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustGear2Val(-1)} disabled={gear2Val <= 1}>−</button>
                  <span className="stepper-num">{gear2Val}</span>
                  <button className="btn btn-outline btn-sm stepper-btn" onClick={() => adjustGear2Val(1)} disabled={gear2Val >= 10}>+</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Live Output & Confirmation Question */}
        <div className="station-col-right">
          {/* Live Flow Diagram */}
          <div className="station-panel">
            <h4 className="panel-title">Live Machine Flow</h4>
            <RuleMachineVisual
              type="machine-flow"
              data={{
                input: startInput,
                steps: ruleSteps,
                output: liveSequence[1],
              }}
              compact={true}
            />

            <h4 className="panel-title" style={{ marginTop: '8px' }}>Resulting Sequence</h4>
            <RuleMachineVisual
              type="sequence-strip"
              data={{
                sequence: liveSequence,
                ruleLabel: ruleString,
              }}
              compact={true}
            />
          </div>

          {/* Discovery Confirmation Challenge */}
          <div className={`station-panel conf-question-box ${confShake ? 'anim-shake' : ''}`}>
            <div className="panel-title-row">
              <span className="panel-badge">🧪</span>
              <h4 className="panel-title">Check Your Understanding</h4>
            </div>
            <p className="conf-prompt">
              If a machine’s rule is <strong>"subtract 3, then double,"</strong> what comes out if you feed in <strong>5</strong>?
            </p>
            <div className="conf-options-grid">
              {[1, 4, 7, 10].map(opt => (
                <button
                  key={opt}
                  className={`conf-opt-btn ${confAnswer === opt ? (opt === 4 ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleConfSelect(opt)}
                  disabled={confPassed}
                >
                  {opt}
                </button>
              ))}
            </div>
            {confPassed && (
              <div className="conf-success-banner anim-slide-up">
                <span>✅ Correct! (5 − 3 = 2, then 2 × 2 = 4). Lab complete!</span>
              </div>
            )}
          </div>

          {/* Completion CTA */}
          <div className="station-footer-actions">
            {confPassed ? (
              <button className="btn btn-primary btn-lg w-full anim-pulse" onClick={onComplete}>
                Complete Station A ✓
              </button>
            ) : (
              <div className="completion-hint-text">
                Answer the check question above to complete this station!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
