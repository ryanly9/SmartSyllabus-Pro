'use client';
import { useState, useMemo } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useContent, useDeleteContent } from '@/hooks/useApi';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { ContentCard } from '@/components/shared/Cards';
import Pagination from '@/components/shared/Pagination';
import { SkeletonCard } from '@/components/shared/Loader';
import Link from 'next/link';
import { 
  BookOpen, Search, Upload, Filter, Grid3X3, List, 
  SlidersHorizontal, Brain, FileText, X 
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function ContentPage() {
  const { isTeacher } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'processed' | 'pending'
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch real data using React Query hook
  const { data, isLoading } = useContent({ 
    page, 
    limit: ITEMS_PER_PAGE,
    search: search ? search : undefined,
    // Add other params if the backend supports them
  });

  const { mutate: deleteContentApi } = useDeleteContent();

  // Extract content from data response
  const contents = useMemo(() => 
    data?.data?.content || data?.contents || data?.data || [], 
    [data]
  );
  const totalDocs = data?.totalDocs || data?.totalResults || (Array.isArray(contents) ? contents.length : 0);
  const totalPages = data?.totalPages || Math.ceil(totalDocs / ITEMS_PER_PAGE);

  // Filter logic (status filtering on client since backend APIFeatures is limited)
  const filtered = useMemo(() => {
    let items = [...contents];
    if (filter === 'processed') items = items.filter(c => c.isProcessed);
    if (filter === 'pending') items = items.filter(c => !c.isProcessed);
    return items;
  }, [contents, filter]);

  const handleDelete = (id) => {
    setDeletingId(id);
    deleteContentApi(id, {
      onSettled: () => setDeletingId(null)
    });
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', marginBottom: 6 }}>
                Content Library
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Browse and manage all learning materials
              </p>
            </div>
            {isTeacher && (
              <Link href="/upload" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <Upload size={16} /> Upload PDF
              </Link>
            )}
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Total Docs', value: totalDocs, icon: FileText, color: 'var(--primary)' },
            { label: 'Processed', value: contents.filter(c => c.isProcessed).length, icon: Brain, color: 'var(--success)' },
            { label: 'This Page', value: filtered.length, icon: SlidersHorizontal, color: 'var(--warning)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 20px', background: 'var(--card)',
              border: '1px solid var(--border)', borderRadius: 10,
              flex: '1 1 140px', minWidth: 140,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${color}18`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--foreground)' }}>{isLoading ? '...' : value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 24, flexWrap: 'wrap',
        }}>
          {/* Search Input */}
          <div style={{
            flex: '1 1 280px', position: 'relative', minWidth: 200,
          }}>
            <Search size={16} style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search content by title..."
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

          {/* Filter Buttons */}
          <div style={{
            display: 'flex', gap: 4, padding: 4,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 10,
          }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'processed', label: 'Processed' },
              { key: 'pending', label: 'Pending' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setPage(1); }}
                style={{
                  padding: '7px 16px', borderRadius: 7, fontSize: 13,
                  fontWeight: filter === key ? 600 : 400, border: 'none',
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: filter === key ? 'var(--primary)' : 'transparent',
                  color: filter === key ? 'white' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div style={{
            display: 'flex', gap: 2, padding: 4,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 10,
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: 8, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex', transition: 'all 0.2s',
              }}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: 8, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === 'list' ? 'var(--primary-light)' : 'transparent',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex', transition: 'all 0.2s',
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {isLoading ? 'Loading content...' : (
              <>
                Showing <strong style={{ color: 'var(--foreground)' }}>{filtered.length}</strong> of{' '}
                <strong style={{ color: 'var(--foreground)' }}>{totalDocs}</strong> items
                {search && (
                  <span> for &ldquo;<span style={{ color: 'var(--primary)' }}>{search}</span>&rdquo;</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Content Grid / List */}
        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
            gap: 20,
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
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
                <BookOpen size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--foreground)', marginBottom: 8 }}>
                {search ? 'No matches found' : 'No content yet'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                {search
                  ? 'Try adjusting your search or filters.'
                  : isTeacher
                    ? 'Upload your first PDF to start generating AI content.'
                    : 'No content available yet. Check back soon!'}
              </p>
              {search && (
                <button
                  onClick={() => { setSearch(''); setFilter('all'); setPage(1); }}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
              )}
              {!search && isTeacher && (
                <Link href="/upload" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  <Upload size={16} /> Upload PDF
                </Link>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 20,
          }}>
            {filtered.map((content) => (
              <ContentCard
                key={content._id}
                content={content}
                showActions={true}
                onDelete={isTeacher ? handleDelete : undefined}
                isDeleting={deletingId === content._id}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((content) => (
              <div
                key={content._id}
                className="card"
                style={{
                  padding: 0, overflow: 'hidden', display: 'flex',
                  alignItems: 'stretch', cursor: 'default',
                }}
              >
                {/* Status stripe */}
                <div style={{
                  width: 4, flexShrink: 0,
                  background: content.isProcessed
                    ? 'linear-gradient(180deg, var(--success), var(--secondary))'
                    : 'linear-gradient(180deg, var(--primary), var(--accent))',
                }} />
                <div style={{
                  flex: 1, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span className={`badge ${content.isProcessed ? 'badge-success' : 'badge-warning'}`}>
                        {content.isProcessed ? '✓ Processed' : '⏳ Pending'}
                      </span>
                    </div>
                    <h3 style={{
                      fontWeight: 700, fontSize: 15, color: 'var(--foreground)',
                      marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {content.title}
                    </h3>
                    <p style={{
                      fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {content.summary}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', gap: 24, alignItems: 'center',
                    fontSize: 12, color: 'var(--text-secondary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Brain size={14} color="var(--primary)" />
                      <span>{content.mcqs?.length || 0} MCQs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <BookOpen size={14} color="var(--secondary)" />
                      <span>{content.questions?.length || 0} Qs</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      href={`/content/${content._id}`}
                      className="btn btn-primary"
                      style={{ fontSize: 13, padding: '8px 16px', textDecoration: 'none' }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - only show if search doesn't limit results artificially */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
