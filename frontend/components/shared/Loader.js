'use client';

export default function Loader({ size = 'md', text, fullPage = false }) {
  const sizes = { sm: 20, md: 32, lg: 48, xl: 64 };
  const px = sizes[size] || 32;

  const spinner = (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: px, height: px, borderRadius: '50%',
        border: `${px / 10}px solid var(--border)`,
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto',
      }} />
      {text && (
        <p style={{
          marginTop: 12, color: 'var(--text-muted)',
          fontSize: 14, fontWeight: 500
        }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--background)'
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ height: 32, width: 80 }} />
        <div className="skeleton" style={{ height: 32, width: 80 }} />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 12, width: '60%' }} />
      </div>
      <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 100 }} />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}
