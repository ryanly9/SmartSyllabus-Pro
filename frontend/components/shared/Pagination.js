'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn btn-secondary"
        style={{ padding: '8px 10px' }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="btn"
          style={{
            padding: '8px 14px',
            background: p === page ? 'var(--primary)' : 'var(--card)',
            color: p === page ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`,
            fontWeight: p === page ? 700 : 400,
          }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn btn-secondary"
        style={{ padding: '8px 10px' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
