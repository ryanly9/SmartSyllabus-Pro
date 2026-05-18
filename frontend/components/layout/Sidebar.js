'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import { getInitials, getRoleBadgeClass, capitalize } from '@/utils/helpers';
import {
  LayoutDashboard, Upload, BookOpen, Trophy, Users,
  GraduationCap, Brain, LogOut, ChevronRight, Settings
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
  { href: '/upload', label: 'Upload PDF', icon: Upload, roles: ['admin', 'teacher'] },
  { href: '/content', label: 'Content Library', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
  { href: '/results', label: 'Results', icon: Trophy, roles: ['admin', 'teacher', 'student'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout, isTeacher, isAdmin } = useAuth();

  const filteredNav = navItems.filter(
    item => !item.roles || item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          }}
          className="lg:hidden"
        />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 260, background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--foreground)' }}>SmartSyllabus Pro</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>E-Learning Content Generator & Quiz Portal</div>
            </div>
          </Link>
        </div>

        {/* User profile */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar" style={{ width: 42, height: 42, fontSize: 15 }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, marginTop: 2 }}>
                <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
                  {capitalize(user?.role)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, padding: '0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Menu
          </div>
          {filteredNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href} onClick={onClose} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 8, textDecoration: 'none', marginBottom: 2,
                background: active ? 'var(--primary-light)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: 14, transition: 'all 0.2s ease',
              }}>
                <Icon size={18} />
                <span style={{ flex: 1 }}>{label}</span>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', margin: '16px 0 8px', padding: '0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Admin
              </div>
              <Link href="/admin/users" onClick={onClose} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 8, textDecoration: 'none', marginBottom: 2,
                color: 'var(--text-secondary)', fontSize: 14, transition: 'all 0.2s ease',
              }}>
                <Users size={18} />
                <span>Manage Users</span>
              </Link>
            </>
          )}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12, padding: '10px 12px' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
