'use client';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { getInitials } from '@/utils/helpers';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      height: 64,
      background: 'rgba(15, 17, 23, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
    }}>
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="btn btn-ghost"
        style={{ padding: 8 }}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 480 }}>
        {searchOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid var(--primary)', borderRadius: 8, padding: '0 12px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              autoFocus
              placeholder="Search content, quizzes..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 14, padding: '10px 0' }}
            />
            <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 14, width: '100%',
              transition: 'all 0.2s',
            }}
          >
            <Search size={15} />
            <span>Search...</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, background: 'var(--border)', padding: '2px 6px', borderRadius: 4 }}>⌘K</span>
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-ghost" style={{ padding: 8, position: 'relative' }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent)',
            border: '2px solid var(--background)',
          }} />
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 12px', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
        }}>
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
