// src/components/phases/WonderPhase.jsx
// Wonder Phase for RuleQuest (Grade 7 Term-to-Term Rules)

import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['⚙️', '🔧', '🔄', '🔀', '🏷️', '⭐', '🏆', '🎯', '💡', '🦫', '✨'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">⚙️</div>
          <h1 className="wonder-title headline">The Mystery of the Sequence Machine!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">4 ➔ 9 ➔ 14 ➔ 19 ➔ … What's the Rule?</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              A dusty machine in the workshop's attic hums to life. Feed it a number, and out comes another — <strong className="wonder-em">but nobody remembers what it does!</strong>
            </p>
            <p className="body-text wonder-q">
              Can you figure out the <span className="wonder-highlight">term-to-term rule</span>… and run the machine backwards to find out where the sequence started?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Let's investigate how sequence machines work and how to run them backwards!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Enter the Workshop 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
