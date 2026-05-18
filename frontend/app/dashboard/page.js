'use client';
import { useAuth } from '@/store/AuthContext';
import { useContent, useResults } from '@/hooks/useApi';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { ContentCard } from '@/components/shared/Cards';
import { SkeletonCard } from '@/components/shared/Loader';
import Link from 'next/link';
import {
  BookOpen, Trophy, Upload, Brain, TrendingUp,
  ArrowRight, Zap, Users, FileText, ChevronRight
} from 'lucide-react';
import { getScoreColor } from '@/utils/helpers';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8 }}>{label}</p>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--foreground)' }}>{value}</div>
          {trend && (
            <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} /> {trend}
            </div>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: color || 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={color ? 'white' : 'var(--primary)'} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon size={28} color="var(--primary)" />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 17, color: 'var(--foreground)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>{description}</p>
      {action}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isTeacher, isAdmin } = useAuth();
  const { data: contentData, isLoading: contentLoading } = useContent({ limit: 6 });
  const { data: resultsData, isLoading: resultsLoading } = useResults({ limit: 5 });

  const contents = contentData?.data?.content || contentData?.contents || contentData?.data || [];
  const results = resultsData?.data?.results || resultsData?.results || resultsData?.data || [];
  const totalContent = contentData?.totalDocs || contentData?.total || (Array.isArray(contents) ? contents.length : 0);
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / results.length)
    : 0;

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', marginBottom: 6 }}>
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                {isTeacher
                  ? "Here's what's happening with your content today."
                  : "Continue your learning journey."}
              </p>
            </div>
            {isTeacher && (
              <Link href="/upload" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <Upload size={16} /> Upload PDF
              </Link>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
          <StatCard
            icon={FileText}
            label="Total Content"
            value={contentLoading ? '—' : totalContent}
            trend="+3 this week"
          />
          <StatCard
            icon={Trophy}
            label="Quizzes Taken"
            value={resultsLoading ? '—' : results.length}
            trend={results.length > 0 ? 'Keep going!' : undefined}
          />
          {!isTeacher && (
            <StatCard
              icon={TrendingUp}
              label="Avg. Score"
              value={resultsLoading ? '—' : `${avgScore}%`}
              trend={avgScore > 70 ? 'Great performance!' : undefined}
            />
          )}
          {isTeacher && (
            <StatCard
              icon={Brain}
              label="AI Generated"
              value={contentLoading ? '—' : contents.filter(c => c.isProcessed).length}
              trend="AI-powered content"
            />
          )}
        </div>

        {/* Quick actions – teacher */}
        {isTeacher && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { href: '/upload', icon: Upload, label: 'Upload New PDF', desc: 'Add learning material', color: 'linear-gradient(135deg, var(--primary), #7c4dff)' },
                { href: '/content', icon: BookOpen, label: 'Content Library', desc: 'Browse all content', color: 'linear-gradient(135deg, var(--secondary), #00b894)' },
                { href: '/results', icon: Trophy, label: 'View Results', desc: 'Student performance', color: 'linear-gradient(135deg, var(--warning), #e67e22)' },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link key={href} href={href} style={{
                  textDecoration: 'none', padding: 20, borderRadius: 14,
                  background: color, display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 28 }}>
          {/* Recent Content */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>
                Recent Content
              </h2>
              <Link href="/content" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>

            {contentLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : contents.length === 0 ? (
              <div className="card" style={{ padding: 0 }}>
                <EmptyState
                  icon={BookOpen}
                  title="No content yet"
                  description={isTeacher ? "Upload your first PDF to get started." : "No content available yet."}
                  action={isTeacher && (
                    <Link href="/upload" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                      <Upload size={16} /> Upload PDF
                    </Link>
                  )}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {contents?.slice(0, 3).map(content => (
                  <ContentCard
                    key={content._id}
                    content={content}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>
                Recent Quiz Results
              </h2>
              <Link href="/results" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>

            {resultsLoading ? (
              <div className="card" style={{ padding: 20 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    </div>
                    <div className="skeleton" style={{ width: 48, height: 24 }} />
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="card" style={{ padding: 0 }}>
                <EmptyState
                  icon={Trophy}
                  title="No results yet"
                  description={isTeacher ? "Students haven't taken any quizzes yet." : "Take a quiz to see your results here."}
                  action={!isTeacher && (
                    <Link href="/content" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                      <BookOpen size={16} /> Browse Content
                    </Link>
                  )}
                />
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {results.map((result, i) => {
                  const pct = result.percentage ?? 0;
                  const scoreColor = getScoreColor(pct);
                  return (
                    <div key={result._id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 20px',
                      borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: `${scoreColor}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Trophy size={20} color={scoreColor} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {result.contentId?.title || 'Quiz Result'}
                        </div>
                        {isTeacher && result.userId && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            by {result.userId?.name || 'Student'}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: scoreColor }}>
                        {pct.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
