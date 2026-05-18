'use client';
import { CheckCircle, XCircle } from 'lucide-react';

export function QuestionCard({ question, index, selected, onSelect, disabled = false, showResult = false, correctAnswer }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 24,
      marginBottom: 20,
      transition: 'all 0.2s',
    }}>
      {/* Question text */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <span style={{
          minWidth: 28, height: 28, borderRadius: '50%',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700,
        }}>
          {index + 1}
        </span>
        <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)', lineHeight: 1.5 }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {question.options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = showResult && option === correctAnswer;
          const isWrong = showResult && isSelected && option !== correctAnswer;

          let borderColor = 'var(--border)';
          let bg = 'transparent';
          let textColor = 'var(--text-secondary)';

          if (isCorrect) { borderColor = 'var(--success)'; bg = 'var(--success-light)'; textColor = 'var(--success)'; }
          else if (isWrong) { borderColor = 'var(--error)'; bg = 'var(--error-light)'; textColor = 'var(--error)'; }
          else if (isSelected) { borderColor = 'var(--primary)'; bg = 'var(--primary-light)'; textColor = 'var(--primary)'; }

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect?.(option)}
              disabled={disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 8, textAlign: 'left',
                border: `1px solid ${borderColor}`, background: bg,
                color: textColor, cursor: disabled ? 'default' : 'pointer',
                transition: 'all 0.2s', width: '100%', fontSize: 14, fontWeight: isSelected ? 600 : 400,
              }}
            >
              <span style={{
                minWidth: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${isSelected || isCorrect ? borderColor : 'var(--border-light)'}`,
                background: (isSelected || isCorrect) ? borderColor : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'white',
              }}>
                {(isSelected || isCorrect) && (
                  isCorrect ? <CheckCircle size={12} /> : isWrong ? <XCircle size={12} /> : '•'
                )}
              </span>
              {option}
              {isCorrect && <CheckCircle size={16} style={{ marginLeft: 'auto' }} />}
              {isWrong && <XCircle size={16} style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function QuizTimer({ timeLeft, totalTime }) {
  const pct = (timeLeft / totalTime) * 100;
  const color = pct > 50 ? 'var(--success)' : pct > 20 ? 'var(--warning)' : 'var(--error)';
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{
      background: 'var(--card)', border: `2px solid ${color}`,
      borderRadius: 12, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ width: 48, height: 48, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="48" height="48" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span style={{ fontSize: 10, fontWeight: 700, color, position: 'relative' }}>
          {Math.ceil(pct)}%
        </span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', letterSpacing: 2 }}>
          {mins}:{secs}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>remaining</div>
      </div>
    </div>
  );
}
