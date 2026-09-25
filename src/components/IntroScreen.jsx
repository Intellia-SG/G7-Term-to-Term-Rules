// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'Mystery machine alert' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Zhi Hao, Nurul & Sprocket' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 sequence labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review & scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Curriculum · Term-to-Term Rules &amp; Sequences Grade 7
      </div>

      {/* Main Title & Subtitle */}
      <div className="intro-title-group">
        <h1 className="intro-title">
          <span className="text-orange">Rule</span> <span className="text-white">Quest</span>
        </h1>
        <h2 className="intro-subtitle">
          Master Term-to-Term Rules, Sequence Machines, and Reverse Arithmetic
        </h2>
      </div>

      {/* Mascot Speech Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🦫</div>
        <div className="intro-speech-bubble">
          Hi! I'm Sprocket. The workshop sequence machines are jammed! Check every gap, formulate term-to-term rules, and reverse operations to save the day! ⚙️🔧
        </div>
      </div>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>

        <div className="journey-steps-container">
          <div className="journey-row">
            {JOURNEY.map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main CTA */}
      <div className="intro-ctas">
        <button className="btn btn-primary btn-lg intro-cta-main" onClick={startFresh}>
          🚀 Begin Your Journey!
        </button>
        {hasSaved && (
          <button className="btn btn-outline intro-cta-resume" onClick={resumeSession}>
            ↩ Resume Session
          </button>
        )}
      </div>

      {/* Bottom Pills */}
      <div className="intro-bottom-cards">
        <div className="bottom-pill">
          <span className="bottom-pill-icon">🎯</span>
          <span>100 Questions</span>
        </div>
        <div className="bottom-pill">
          <span className="bottom-pill-icon">📈</span>
          <span>Sequences &amp; Machines</span>
        </div>
        <div className="bottom-pill">
          <span className="bottom-pill-icon">✨</span>
          <span>Badges &amp; XP</span>
        </div>
      </div>
    </div>
  );
}
