import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length = 100) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getScoreColor(percentage) {
  if (percentage >= 80) return 'var(--success)';
  if (percentage >= 60) return 'var(--warning)';
  return 'var(--error)';
}

export function getScoreLabel(percentage) {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Great';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Average';
  return 'Needs Improvement';
}

export function formatTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getRoleBadgeClass(role) {
  const map = {
    admin: 'badge-error',
    teacher: 'badge-primary',
    student: 'badge-secondary',
  };
  return map[role] || 'badge-secondary';
}
