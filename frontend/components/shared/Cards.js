'use client';
import { Clock, BookOpen, Brain, ArrowRight, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { formatDate, truncate } from '@/utils/helpers';
import Link from 'next/link';

export function ContentCard({ content, onDelete, isDeleting, showActions = true }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'default' }}>
      {/* Header gradient strip */}
      <div style={{
        height: 4,
        background: content.isProcessed
          ? 'linear-gradient(90deg, var(--success), var(--secondary))'
          : 'linear-gradient(90deg, var(--primary), var(--accent))',
      }} />

      <div style={{ padding: 20 }}>
        {/* Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span className={`badge ${content.isProcessed ? 'badge-success' : 'badge-warning'}`}>
            {content.isProcessed ? '✓ AI Processed' : '⏳ Pending'}
          </span>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
            <Clock size={12} />
            {formatDate(content.createdAt)}
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--foreground)', marginBottom: 8, lineHeight: 1.3 }}>
          {truncate(content.title, 60)}
        </h3>

        {/* Preview */}
        {content.summary && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
            {truncate(content.summary, 100)}
          </p>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Brain size={13} color="var(--primary)" />
            <span>{content.mcqs?.length || 0} MCQs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <BookOpen size={13} color="var(--secondary)" />
            <span>{content.questions?.length || 0} Questions</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/content/${content._id}`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', fontSize: 13 }}>
              View Content <ArrowRight size={14} />
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(content._id)}
                disabled={isDeleting}
                className="btn btn-secondary"
                style={{ padding: '10px 14px', color: 'var(--error)', borderColor: 'var(--error-light)' }}
              >
                {isDeleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizCard({ quiz, onStart }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span className="badge badge-primary">{quiz.mcqs?.length || 0} Questions</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(quiz.createdAt)}</span>
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)', marginBottom: 8 }}>
        {truncate(quiz.title, 50)}
      </h3>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {quiz.mcqs?.length || 0} multiple-choice questions • 30 minute timer
      </p>
      <button onClick={() => onStart?.(quiz)} className="btn btn-primary" style={{ width: '100%', fontSize: 13 }}>
        Start Quiz <ArrowRight size={14} />
      </button>
    </div>
  );
}

export function ResultCard({ result }) {
  const pct = result.percentage ?? 0;
  const color = pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)', marginBottom: 4 }}>
            {truncate(result.contentId?.title || 'Quiz Result', 40)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {formatDate(result.createdAt)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color }}>
            {pct.toFixed(0)}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {result.score}/{result.totalQuestions}
          </div>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}
