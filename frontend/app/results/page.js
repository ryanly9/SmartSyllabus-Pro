'use client';
import { useState, useMemo } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useResults } from '@/hooks/useApi';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import Pagination from '@/components/shared/Pagination';
import { SkeletonCard } from '@/components/shared/Loader';
import {
  Trophy, TrendingUp, Target, Award, BarChart3,
  Calendar, Search, Filter, ChevronDown, X,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { formatDate, getScoreColor, getScoreLabel } from '@/utils/helpers';

const ITEMS_PER_PAGE = 5;

export default function ResultsPage() {
  const { isTeacher } = useAuth();
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all'); // 'all' | 'excellent' | 'good' | 'needs-improvement'
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch real results using React Query
  const { data, isLoading } = useResults({
    page,
    limit: ITEMS_PER_PAGE,
    search: search ? search : undefined,
  });

  // Extract data from response
  const results = useMemo(() => 
    data?.data?.results || data?.results || data?.data || [], 
    [data]
  );
  const totalDocs = data?.totalDocs || data?.totalResults || (Array.isArray(results) ? results.length : 0);
  const totalPages = data?.totalPages || Math.ceil(totalDocs / ITEMS_PER_PAGE);

  // Stats calculation from fetched results (or from a separate stats API if available)
  const stats = useMemo(() => {
    const total = totalDocs;
    if (results.length === 0) return { total, avgPercent: 0, perfect: 0, highest: 0, lowest: 0 };
    
    // Note: These stats are only for the current page/results fetched. 
    // In a production app, the backend should provide aggregate stats.
    const avgPercent = Math.round(results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length);
    const perfect = results.filter(r => r.percentage === 100).length;
    const highest = Math.max(...results.map(r => r.percentage || 0));
    const lowest = Math.min(...results.map(r => r.percentage || 0));
    return { total, avgPercent, perfect, highest, lowest };
  }, [results, totalDocs]);

  // Client-side filtering for score ranges (as backend might not support it yet)
  const filtered = useMemo(() => {
    let items = [...results];
    if (scoreFilter === 'excellent') items = items.filter(r => r.percentage >= 80);
    if (scoreFilter === 'good') items = items.filter(r => r.percentage >= 60 && r.percentage < 80);
    if (scoreFilter === 'needs-improvement') items = items.filter(r => r.percentage < 60);
    return items;
  }, [results, scoreFilter]);

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', marginBottom: 6 }}>
            Quiz Results
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {isTeacher
              ? 'Track student performance across all quizzes'
              : 'Review your quiz scores and performance history'}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 16, marginBottom: 28,
        }}>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>Total Attempts</p>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)' }}>{isLoading ? '...' : stats.total}</div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BarChart3 size={20} color="var(--primary)" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>Avg. Score (Page)</p>
                <div style={{ fontSize: 28, fontWeight: 800, color: getScoreColor(stats.avgPercent) }}>
                  {isLoading ? '...' : `${stats.avgPercent}%`}
                </div>
                {!isLoading && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {getScoreLabel(stats.avgPercent)}
                  </div>
                )}
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--secondary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrendingUp size={20} color="var(--secondary)" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>Perfect Scores</p>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)' }}>{isLoading ? '...' : stats.perfect}</div>
                {!isLoading && (
                  <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 2 }}>
                    {stats.total > 0 ? `${Math.round((stats.perfect / results.length) * 100)}% of page` : '—'}
                  </div>
                )}
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--success-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Award size={20} color="var(--success)" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>Score Range</p>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)' }}>
                  {isLoading ? '...' : `${stats.lowest}–${stats.highest}%`}
                </div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--warning-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Target size={20} color="var(--warning)" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 24, flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 260px', position: 'relative', minWidth: 200 }}>
            <Search size={16} style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={isTeacher ? 'Search by student name or quiz title...' : 'Search by quiz title...'}
              className="input"
              style={{ paddingLeft: 40, paddingRight: search ? 36 : 16 }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', padding: 4,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Score Filter Buttons */}
          <div style={{
            display: 'flex', gap: 4, padding: 4,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 10,
          }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'excellent', label: '≥ 80%' },
              { key: 'good', label: '60-79%' },
              { key: 'needs-improvement', label: '< 60%' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setScoreFilter(key); setPage(1); }}
                style={{
                  padding: '7px 14px', borderRadius: 7, fontSize: 13,
                  fontWeight: scoreFilter === key ? 600 : 400, border: 'none',
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: scoreFilter === key ? 'var(--primary)' : 'transparent',
                  color: scoreFilter === key ? 'white' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {isLoading ? 'Fetching results...' : (
              <>
                Showing <strong style={{ color: 'var(--foreground)' }}>{filtered.length}</strong> of{' '}
                <strong style={{ color: 'var(--foreground)' }}>{totalDocs}</strong> results
              </>
            )}
          </p>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: 0 }}>
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
              }}>
                <Trophy size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--foreground)', marginBottom: 8 }}>
                {search || scoreFilter !== 'all' ? 'No results found' : 'No quiz results yet'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                {search || scoreFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : isTeacher
                    ? 'Students have not taken any quizzes yet.'
                    : 'Take a quiz to see your results here!'}
              </p>
              {(search || scoreFilter !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setScoreFilter('all'); setPage(1); }}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="table-container" style={{ background: 'var(--card)' }}>
            <table>
              <thead>
                <tr>
                  {isTeacher && <th>Student</th>}
                  <th>Quiz / Content</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                  <th>Performance</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((result) => {
                  const pct = result.percentage ?? 0;
                  const scoreColor = getScoreColor(pct);
                  const isExpanded = expandedId === result._id;

                  return (
                    <>
                      <tr
                        key={result._id}
                        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                        onClick={() => setExpandedId(isExpanded ? null : result._id)}
                      >
                        {isTeacher && (
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                                {result.userId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)' }}>
                                  {result.userId?.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                  {result.userId?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {result.contentId?.title || 'Unknown Quiz'}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--foreground)' }}>
                            {result.score}/{result.totalQuestions}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 80, height: 6, borderRadius: 100,
                              background: 'var(--border)', overflow: 'hidden',
                            }}>
                              <div style={{
                                width: `${pct}%`, height: '100%', borderRadius: 100,
                                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                                transition: 'width 0.5s ease',
                              }} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: scoreColor, minWidth: 40 }}>
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                            <Calendar size={13} />
                            {formatDate(result.createdAt)}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              pct >= 80 ? 'badge-success' : pct >= 60 ? 'badge-warning' : 'badge-error'
                            }`}
                          >
                            {getScoreLabel(pct)}
                          </span>
                        </td>
                        <td>
                          <ChevronDown
                            size={16}
                            color="var(--text-muted)"
                            style={{
                              transition: 'transform 0.2s',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        </td>
                      </tr>

                      {/* Expanded Row — Answer Breakdown */}
                      {isExpanded && (
                        <tr key={`${result._id}-expanded`}>
                          <td colSpan={isTeacher ? 7 : 6} style={{ padding: 0 }}>
                            <div style={{
                              padding: '16px 24px',
                              background: 'rgba(108, 99, 255, 0.04)',
                              borderTop: '1px solid var(--border)',
                            }}>
                              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Answer Breakdown
                              </p>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {result.answers?.map((ans, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      width: 40, height: 40, borderRadius: 10,
                                      fontSize: 13, fontWeight: 700,
                                      background: ans.isCorrect ? 'var(--success-light)' : 'var(--error-light)',
                                      color: ans.isCorrect ? 'var(--success)' : 'var(--error)',
                                      border: `1px solid ${ans.isCorrect ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
                                    }}
                                    title={`Q${i + 1}: ${ans.isCorrect ? 'Correct' : 'Wrong'} — Selected: ${ans.selectedOption}`}
                                  >
                                    Q{i + 1}
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--success)' }} />
                                  Correct: {result.answers?.filter(a => a.isCorrect).length || 0}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--error)' }} />
                                  Wrong: {result.answers?.filter(a => !a.isCorrect).length || 0}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* Score Distribution Card */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>
            Score Distribution (Page)
          </h2>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 160 }}>
              {(() => {
                const ranges = [
                  { label: '0-20%', min: 0, max: 20, color: 'var(--error)' },
                  { label: '21-40%', min: 21, max: 40, color: 'var(--accent)' },
                  { label: '41-60%', min: 41, max: 60, color: 'var(--warning)' },
                  { label: '61-80%', min: 61, max: 80, color: 'var(--primary)' },
                  { label: '81-100%', min: 81, max: 100, color: 'var(--success)' },
                ];
                const rangeCounts = ranges.map(r => results.filter(res => (res.percentage || 0) >= r.min && (res.percentage || 0) <= r.max).length);
                const maxCount = Math.max(...rangeCounts, 1);
                
                return ranges.map(({ label, color }, idx) => {
                  const count = rangeCounts[idx];
                  const heightPct = (count / maxCount) * 100;
                  return (
                    <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>{count}</span>
                      <div style={{
                        width: '100%', maxWidth: 60, borderRadius: '8px 8px 4px 4px',
                        height: `${Math.max(heightPct, 8)}%`,
                        background: `linear-gradient(180deg, ${color}, ${color}66)`,
                        transition: 'height 0.5s ease',
                        minHeight: 8,
                      }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center' }}>
                        {label}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Recent High Performers - Static Top List from current page */}
        {isTeacher && results.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>
              🏆 Top Performers (Page)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {[...results]
                .filter(r => (r.percentage || 0) >= 80)
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 4)
                .map((result, i) => {
                  const medals = ['🥇', '🥈', '🥉', '🏅'];
                  return (
                    <div key={result._id} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 22 }}>
                        {medals[i] || '🏅'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>
                          {result.userId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--foreground)' }}>
                            {result.userId?.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {result.contentId?.title?.slice(0, 30)}...
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color: getScoreColor(result.percentage) }}>
                          {result.percentage}%
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {result.score}/{result.totalQuestions} correct
                        </span>
                      </div>
                      <div className="progress-bar" style={{ marginTop: 10 }}>
                        <div className="progress-fill" style={{
                          width: `${result.percentage}%`,
                          background: `linear-gradient(90deg, ${getScoreColor(result.percentage)}, ${getScoreColor(result.percentage)}88)`,
                        }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
