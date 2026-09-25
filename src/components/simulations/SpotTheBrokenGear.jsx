// src/components/simulations/SpotTheBrokenGear.jsx
// Station D: Error-Detective for RuleQuest (Grade 7 Term-to-Term Rules)
// Contract: <StationComponent onComplete={fn} audioEnabled={bool} />

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const DETECTIVE_CASES = [
  {
    id: 1,
    title: 'Case 1: Apprentice Leo’s Rule Statement',
    lines: [
      { num: 1, text: "Sequence under inspection: 6, 11, 16, 21, …", isError: false },
      { num: 2, text: "Observation: The sequence begins at the number 6.", isError: false },
      { num: 3, text: "Apprentice Claim: 'Therefore, the term-to-term rule of the machine is 6.'", isError: true },
    ],
    flawExplanation: "Leo stated the sequence's first term instead of describing the action between terms!",
    correctionOptions: [
      { text: "The rule is an action: 'Add 5', never just the starting number 6", isCorrect: true },
      { text: "The rule is 11", isCorrect: false },
      { text: "The rule is multiply by 6", isCorrect: false },
    ],
  },
  {
    id: 2,
    title: 'Case 2: Apprentice Sam’s Compound Reversal',
    lines: [
      { num: 1, text: "Forward compound rule: Multiply by 3, then subtract 2.", isError: false },
      { num: 2, text: "Step 1: Invert each operation (× becomes ÷, − becomes +).", isError: false },
      { num: 3, text: "Apprentice Reversal: 'Divide by 3, then add 2.'", isError: true },
    ],
    flawExplanation: "Sam swapped each operation for its opposite, but FORGOT to reverse their order!",
    correctionOptions: [
      { text: "Reverse order too: 'Add 2, then divide by 3'", isCorrect: true },
      { text: "Multiply by 2, then add 3", isCorrect: false },
      { text: "Subtract 3, then multiply by 2", isCorrect: false },
    ],
  },
  {
    id: 3,
    title: 'Case 3: Apprentice Maya’s Verification Log',
    lines: [
      { num: 1, text: "Testing proposed rule 'Add 4' on sequence: 3, 7, 11, 16.", isError: false },
      { num: 2, text: "Step 1: Check 3 to 7: 7 − 3 = 4. Rule holds!", isError: false },
      { num: 3, text: "Apprentice Log: 'Since pair 1 worked, the rule is verified for the whole sequence.'", isError: true },
    ],
    flawExplanation: "Maya stopped after checking only the first pair! Gap between 11 and 16 is 5, so the rule fails.",
    correctionOptions: [
      { text: "Must check every pair: 16 − 11 = 5, so 'Add 4' fails!", isCorrect: true },
      { text: "Checking pair 1 is always enough", isCorrect: false },
      { text: "The sequence should start with 4", isCorrect: false },
    ],
  },
];

export default function SpotTheBrokenGear({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [caseIdx, setCaseIdx] = useState(0);

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [solvedCurrent, setSolvedCurrent] = useState(false);
  const [completedCases, setCompletedCases] = useState([false, false, false]);

  const currentCase = DETECTIVE_CASES[caseIdx];

  function handleLineClick(line) {
    sounds.click();
    setSelectedLine(line.num);
    setSelectedCorrection(null);
    setSolvedCurrent(false);

    if (line.isError) {
      sounds.badge();
      narrate([{ text: "Broken gear spotted! Now select the correct fix below.", style: 'encouragement' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "That line is mathematically sound. Look for the seeded misconception!", style: 'thinking' }]);
    }
  }

  function handleSelectCorrection(opt) {
    sounds.click();
    setSelectedCorrection(opt.text);

    if (opt.isCorrect) {
      sounds.correct();
      setSolvedCurrent(true);
      const updated = [...completedCases];
      updated[caseIdx] = true;
      setCompletedCases(updated);
      narrate([{ text: "Excellent detective work! You spotted the flaw and repaired the gear!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "That fix isn't right. Review the golden rules of term-to-term sequences!", style: 'thinking' }]);
    }
  }

  function nextCase() {
    sounds.click();
    setCaseIdx((caseIdx + 1) % DETECTIVE_CASES.length);
    setSelectedLine(null);
    setSelectedCorrection(null);
    setSolvedCurrent(false);
  }

  const allSolved = completedCases.some(Boolean);

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: Spot the Broken Gear</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case {caseIdx + 1} of 3:</span>
          <span className="station-target-num" style={{ fontSize: '0.95rem' }}>
            {currentCase.title}
          </span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Log Lines with Error Tap */}
        <div className="station-col-left">
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">1</span>
              <h4 className="panel-title">Tap the Line with the Mistake</h4>
            </div>
            <p className="panel-subtext">
              Inspect the apprentice’s working. One line contains a fatal reasoning flaw:
            </p>

            <div className="broken-gear-lines-list">
              {currentCase.lines.map(line => {
                const isSelected = selectedLine === line.num;
                const isErr = line.isError;
                let lineClass = 'gear-line-item';
                if (isSelected) {
                  lineClass += isErr ? ' line-broken-found' : ' line-innocent';
                }
                return (
                  <button
                    key={line.num}
                    className={lineClass}
                    onClick={() => handleLineClick(line)}
                  >
                    <span className="gear-line-num">Line {line.num}</span>
                    <span className="gear-line-text">{line.text}</span>
                    {isSelected && (
                      <span className="gear-line-tag">
                        {isErr ? '⚠️ BROKEN' : '✓ OK'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedLine && currentCase.lines.find(l => l.num === selectedLine)?.isError && (
              <div className="feedback-note note-success anim-slide-up" style={{ marginTop: '8px' }}>
                🎯 <strong>Flaw Identified:</strong> {currentCase.flawExplanation}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Supply the Correction */}
        <div className="station-col-right">
          <div className="station-panel">
            <div className="panel-title-row">
              <span className="panel-badge">2</span>
              <h4 className="panel-title">Select the Correct Repair</h4>
            </div>
            <p className="panel-subtext">
              How should the apprentice correct this sequence rule or reversal?
            </p>

            <div className="correction-options-list">
              {currentCase.correctionOptions.map((opt, i) => {
                const isSelected = selectedCorrection === opt.text;
                let btnClass = 'correction-opt-btn';
                if (isSelected) {
                  btnClass += opt.isCorrect ? ' opt-correct' : ' opt-wrong';
                }
                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => handleSelectCorrection(opt)}
                    disabled={!selectedLine || !currentCase.lines.find(l => l.num === selectedLine)?.isError}
                  >
                    <span className="correction-opt-radio">{isSelected ? (opt.isCorrect ? '✅' : '❌') : '⚪'}</span>
                    <span className="correction-opt-text">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {solvedCurrent && (
              <div className="feedback-note note-success anim-slide-up" style={{ marginTop: '10px' }}>
                🎉 Broken gear repaired! Case solved successfully.
              </div>
            )}
          </div>

          {/* Action to switch cases */}
          <div className="calibrate-actions-row">
            <button className="btn btn-outline btn-md" onClick={nextCase}>
              Inspect Another Case ➔
            </button>
          </div>

          {/* Completion CTA */}
          <div className="station-footer-actions">
            {allSolved ? (
              <button className="btn btn-green btn-lg w-full anim-pulse" onClick={onComplete}>
                Complete Station D ✓
              </button>
            ) : (
              <div className="completion-hint-text">
                Tap the flawed line and select the fix to complete this station!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
