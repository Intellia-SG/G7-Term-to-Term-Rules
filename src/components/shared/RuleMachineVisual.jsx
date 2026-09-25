// src/components/shared/RuleMachineVisual.jsx
import React from 'react';
import './RuleMachineVisual.css';

/**
 * Visual aid for RuleQuest questions and simulations.
 * Supported types:
 * - 'machine-flow': Left-to-right term flow through 1 or 2 operation gears.
 * - 'reverse-flow': Right-to-left reverse term flow with inverse operations.
 * - 'sequence-strip': Sequence terms in visual cards with transition arcs.
 * - 'fibonacci-pair': Highlights two previous terms combining into the next term.
 */
export default function RuleMachineVisual({ type = 'sequence-strip', data, compact = false }) {
  if (!data) return null;

  if (type === 'machine-flow') {
    const { input, steps = [], output } = data;
    return (
      <div className={`rule-machine-visual machine-flow-wrap ${compact ? 'compact' : ''}`}>
        <div className="flow-container">
          {/* Input Box */}
          <div className="machine-node input-node">
            <span className="node-tag">INPUT</span>
            <span className="node-val">{input ?? '?'}</span>
          </div>

          <div className="flow-arrow">➔</div>

          {/* Gears / Operations */}
          <div className="machine-gears-group">
            {steps.map((st, i) => (
              <React.Fragment key={i}>
                <div className={`machine-gear-badge op-${st.op}`}>
                  <span className="gear-icon">⚙️</span>
                  <div className="gear-desc">
                    <span className="gear-step-num">Step {i + 1}</span>
                    <span className="gear-op-label">
                      {st.op === 'add' ? `+ ${st.value}` :
                       st.op === 'subtract' ? `− ${st.value}` :
                       st.op === 'multiply' ? `× ${st.value}` :
                       st.op === 'divide' ? `÷ ${st.value}` :
                       `${st.op} ${st.value}`}
                    </span>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="inner-flow-arrow">➔</div>}
              </React.Fragment>
            ))}
          </div>

          <div className="flow-arrow">➔</div>

          {/* Output Box */}
          <div className="machine-node output-node">
            <span className="node-tag">OUTPUT</span>
            <span className="node-val">{output ?? '?'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'reverse-flow') {
    const { laterTerm, laterIndex = 'Later Term', steps = [], targetIndex = 'Earlier Term', targetVal } = data;
    return (
      <div className={`rule-machine-visual reverse-flow-wrap ${compact ? 'compact' : ''}`}>
        <div className="reverse-flow-header">
          <span className="reverse-badge">🔄 REVERSE RUN</span>
          <span className="reverse-note">Opposite operations in reverse order</span>
        </div>
        <div className="flow-container reverse-direction">
          {/* Output / End term */}
          <div className="machine-node later-node">
            <span className="node-tag">{laterIndex}</span>
            <span className="node-val">{laterTerm ?? '?'}</span>
          </div>

          <div className="flow-arrow rev-arrow">⬅️</div>

          {/* Reversed Operations */}
          <div className="machine-gears-group reverse-gears">
            {steps.map((st, i) => (
              <React.Fragment key={i}>
                <div className={`machine-gear-badge rev-badge op-${st.op}`}>
                  <span className="gear-icon">🔄</span>
                  <div className="gear-desc">
                    <span className="gear-step-num">Reverse Step {i + 1}</span>
                    <span className="gear-op-label">
                      {st.op === 'add' ? `+ ${st.value}` :
                       st.op === 'subtract' ? `− ${st.value}` :
                       st.op === 'multiply' ? `× ${st.value}` :
                       st.op === 'divide' ? `÷ ${st.value}` :
                       `${st.op} ${st.value}`}
                    </span>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="inner-flow-arrow rev-arrow">⬅️</div>}
              </React.Fragment>
            ))}
          </div>

          <div className="flow-arrow rev-arrow">⬅️</div>

          {/* Target earlier term */}
          <div className="machine-node target-node">
            <span className="node-tag">{targetIndex}</span>
            <span className="node-val">{targetVal ?? '?'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'fibonacci-pair') {
    const { sequence = [], highlightIndices = [0, 1], targetIndex = 2 } = data;
    return (
      <div className={`rule-machine-visual fibonacci-wrap ${compact ? 'compact' : ''}`}>
        <div className="fibonacci-title-bar">
          <span className="fib-badge">🔀 TWIN-INPUT SUM</span>
          <span className="fib-subtitle">Sum of previous two terms</span>
        </div>
        <div className="fib-strip">
          {sequence.map((term, i) => {
            const isContributing = highlightIndices.includes(i);
            const isTarget = i === targetIndex;
            return (
              <div
                key={i}
                className={`fib-cell ${isContributing ? 'contributor' : ''} ${isTarget ? 'target' : ''}`}
              >
                <div className="fib-pos">Term {i + 1}</div>
                <div className="fib-val">{term === '?' ? '?' : term}</div>
                {isContributing && <div className="fib-indicator">Input</div>}
                {isTarget && <div className="fib-indicator target-tag">Sum</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: 'sequence-strip'
  const { sequence = [], ruleLabel, breakIndex = null, highlightNext = false } = data;
  return (
    <div className={`rule-machine-visual sequence-strip-wrap ${compact ? 'compact' : ''}`}>
      <div className="strip-container">
        {sequence.map((term, i) => {
          const isBreak = breakIndex !== null && i === breakIndex;
          const isNext = highlightNext && i === sequence.length - 1;
          return (
            <React.Fragment key={i}>
              <div className={`seq-card ${isBreak ? 'seq-break' : ''} ${isNext ? 'seq-target' : ''}`}>
                <span className="seq-idx">T{i + 1}</span>
                <span className="seq-val">{term}</span>
              </div>
              {i < sequence.length - 1 && (
                <div className="seq-transition">
                  <div className="seq-arc">
                    <span className="seq-rule-chip">
                      {ruleLabel || '➔'}
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
