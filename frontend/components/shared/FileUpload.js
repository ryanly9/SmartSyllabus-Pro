'use client';
import { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = '.pdf', maxSizeMB = 10 }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const validate = (f) => {
    if (!f) return 'No file selected';
    const ext = f.name.split('.').pop().toLowerCase();
    if (accept !== '*' && !accept.includes(ext)) return `Only ${accept} files allowed`;
    if (f.size > maxSizeMB * 1024 * 1024) return `File must be under ${maxSizeMB}MB`;
    return null;
  };

  const handleFile = useCallback((f) => {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError(null);
    setFile(f);
    onFileSelect?.(f);
  }, [onFileSelect]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileSelect?.(null);
  };

  if (file) {
    return (
      <div style={{
        border: '2px solid var(--success)', borderRadius: 12,
        padding: 20, background: 'var(--success-light)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <CheckCircle size={24} color="var(--success)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
        <button onClick={removeFile} style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(244,67,54,0.1)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--error)', transition: 'all 0.2s',
        }}>
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 12,
          border: `2px dashed ${dragging ? 'var(--primary)' : error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 12, padding: '40px 24px',
          background: dragging ? 'var(--primary-light)' : 'transparent',
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
      >
        <input type="file" accept={accept} onChange={onInputChange} style={{ display: 'none' }} />
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: dragging ? 'var(--primary)' : 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          <Upload size={24} color={dragging ? 'white' : 'var(--primary)'} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>
            Drop your PDF here
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            or <span style={{ color: 'var(--primary)', fontWeight: 500 }}>browse to upload</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            Supports {accept} • Max {maxSizeMB}MB
          </div>
        </div>
      </label>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: 'var(--error)', fontSize: 13 }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
