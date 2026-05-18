'use client';
import { useState, useMemo, use } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useContentById } from '@/hooks/useApi';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import Loader from '@/components/shared/Loader';
import Link from 'next/link';
import { 
  BookOpen, Brain, Clock, FileText, ChevronLeft, 
  Download, PlayCircle, Layers, CheckCircle, 
  MessageSquare, Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function ViewContentPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const { user, isTeacher } = useAuth();
  const { data, isLoading, isError, refetch } = useContentById(id);
  const [activeTab, setActiveTab] = useState('summary'); // summary | mcqs | questions | notes

  // Extract content from data response
  const content = data?.data?.content || data?.content;

  // Tabs configuration
  const tabs = [
    { id: 'summary', label: 'AI Summary', icon: FileText },
    { id: 'notes', label: 'Study Notes', icon: BookOpen },
    { id: 'mcqs', label: 'Practice MCQs', icon: Brain, count: content?.mcqs?.length },
    { id: 'questions', label: 'Q&A', icon: MessageSquare, count: content?.questions?.length },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader text="Generating insights with AI..." size="lg" />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (isError || !content) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: 'var(--error-light)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
            }}>
              <FileText size={40} color="var(--error)" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Content Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 500, marginInline: 'auto' }}>
              We couldn&apos;t find the content you&apos;re looking for. It might have been deleted or the link is incorrect.
            </p>
            <Link href="/content" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Back to Library
            </Link>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/content" style={{ 
            display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', 
            textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: '0.2s'
          }} className="hover-primary">
            <ChevronLeft size={16} /> Content Library
          </Link>
          <span style={{ color: 'var(--border)', fontSize: 14 }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>View Content</span>
        </div>

        {/* Content Header */}
        <div className="card" style={{ 
          marginBottom: 24, padding: '32px', border: 'none',
          background: 'linear-gradient(135deg, var(--card) 0%, var(--background) 100%)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative Background Elements */}
          <div style={{ 
            position: 'absolute', top: -40, right: -40, width: 200, height: 200, 
            background: 'var(--primary-light)', borderRadius: '50%', opacity: 0.1, zIndex: 0 
          }} />
          <div style={{ 
            position: 'absolute', bottom: -20, left: '20%', width: 100, height: 100, 
            background: 'var(--secondary-light)', borderRadius: '50%', opacity: 0.1, zIndex: 0 
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className={`badge ${content.isProcessed ? 'badge-success' : 'badge-warning'}`} style={{ padding: '4px 12px' }}>
                    {content.isProcessed ? '✓ AI Processed' : '⏳ Processing'}
                  </span>
                  <div style={{ height: 4, width: 4, borderRadius: '50%', background: 'var(--border)' }} />
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} /> {formatDate(content.createdAt)}
                  </div>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 850, color: 'var(--foreground)', marginBottom: 14, lineHeight: 1.2 }}>
                  {content.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', 
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13
                  }}>
                    {content.uploadedBy?.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Uploaded by </span>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{content.uploadedBy?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {isTeacher && (
                  <button onClick={() => refetch()} className="btn btn-secondary" style={{ gap: 8 }}>
                    <RefreshCw size={16} /> Regenerate
                  </button>
                )}
                <button className="btn btn-secondary" style={{ gap: 8 }}>
                  <Download size={16} /> PDF
                </button>
                {content.mcqs?.length > 0 && (
                  <Link href={`/quiz/${content._id}`} className="btn btn-primary" style={{ textDecoration: 'none', gap: 8 }}>
                    <PlayCircle size={18} /> Take Quiz
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
          {/* Main Content Area */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Custom Tab Bar */}
            <div style={{ 
              display: 'flex', borderBottom: '1px solid var(--border)', 
              background: 'var(--card)', overflowX: 'auto', gap: 8, padding: '0 16px'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 20px', fontSize: 14, fontWeight: 600, border: 'none',
                    background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                    borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
                    transition: 'all 0.2s', whiteSpace: 'nowrap', position: 'relative'
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span style={{ 
                      fontSize: 10, background: activeTab === tab.id ? 'var(--primary-light)' : 'var(--background)',
                      padding: '2px 6px', borderRadius: 10, minWidth: 20, textAlign: 'center'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ padding: '32px' }}>
              {/* Summary Tab */}
              {activeTab === 'summary' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Sparkles size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800 }}>AI Generated Summary</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Quick overview of the key concepts</p>
                    </div>
                  </div>
                  <div style={{ 
                    lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: 15,
                    whiteSpace: 'pre-wrap', background: 'var(--background)', padding: 24, borderRadius: 12,
                    border: '1px solid var(--border)'
                  }}>
                    {content.summary || "No summary available for this content."}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 10, background: 'var(--secondary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Layers size={20} color="var(--secondary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800 }}>Study Notes</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Structured breakdown of the material</p>
                    </div>
                  </div>
                  <div style={{ 
                    lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: 15,
                    whiteSpace: 'pre-wrap', background: 'var(--background)', padding: 24, borderRadius: 12,
                    border: '1px solid var(--border)'
                  }}>
                    {content.notes || "No study notes available for this content."}
                  </div>
                </div>
              )}

              {/* MCQs Tab */}
              {activeTab === 'mcqs' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 10, background: 'var(--success-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Brain size={20} color="var(--success)" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800 }}>Multiple Choice Questions</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Test your knowledge with these MCQs</p>
                      </div>
                    </div>
                    {content.mcqs?.length > 0 && (
                      <Link href={`/quiz/${content._id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>
                        Start Interactive Quiz
                      </Link>
                    )}
                  </div>

                  {content.mcqs && content.mcqs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {content.mcqs.map((mcq, idx) => (
                        <div key={idx} style={{ 
                          padding: 24, borderRadius: 12, background: 'var(--background)', 
                          border: '1px solid var(--border)', position: 'relative'
                        }}>
                          <div style={{ 
                            position: 'absolute', left: -10, top: 20, width: 28, height: 28, 
                            borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700
                          }}>
                            {idx + 1}
                          </div>
                          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, paddingLeft: 10 }}>{mcq.question}</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {mcq.options.map((opt, i) => (
                              <div key={i} style={{ 
                                padding: '12px 16px', borderRadius: 8, fontSize: 14,
                                border: '1px solid var(--border)', background: 'var(--card)',
                                color: opt === mcq.correctAnswer ? 'var(--success)' : 'var(--text-secondary)',
                                fontWeight: opt === mcq.correctAnswer ? 600 : 400,
                                display: 'flex', alignItems: 'center', gap: 10
                              }}>
                                <div style={{ 
                                  width: 20, height: 20, borderRadius: '50%', 
                                  border: `1px solid ${opt === mcq.correctAnswer ? 'var(--success)' : 'var(--border)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10
                                }}>
                                  {String.fromCharCode(65 + i)}
                                </div>
                                {opt}
                                {opt === mcq.correctAnswer && <CheckCircle size={14} style={{ marginLeft: 'auto' }} />}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed var(--border)', borderRadius: 12 }}>
                      <Brain size={48} color="var(--border)" style={{ marginBottom: 12 }} />
                      <p style={{ color: 'var(--text-muted)' }}>No MCQs generated for this content.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 10, background: 'var(--warning-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MessageSquare size={20} color="var(--warning)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800 }}>Short Answer Questions</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Conceptual questions for deeper understanding</p>
                    </div>
                  </div>

                  {content.questions && content.questions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {content.questions.map((q, idx) => (
                        <div key={idx} style={{ 
                          padding: 24, borderRadius: 12, background: 'var(--background)', 
                          border: '1px solid var(--border)'
                        }}>
                          <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ 
                              width: 32, height: 32, borderRadius: 8, background: 'var(--warning-light)', 
                              color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 800, flexShrink: 0
                            }}>
                              Q
                            </div>
                            <div>
                              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{q.question}</h4>
                              <div style={{ 
                                padding: 16, borderRadius: 10, background: 'var(--card)', 
                                border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic'
                              }}>
                                <span style={{ fontWeight: 700, fontStyle: 'normal', color: 'var(--text-secondary)', marginRight: 8 }}>Suggested Answer:</span>
                                {q.suggestedAnswer || "No suggested answer provided."}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed var(--border)', borderRadius: 12 }}>
                      <MessageSquare size={48} color="var(--border)" style={{ marginBottom: 12 }} />
                      <p style={{ color: 'var(--text-muted)' }}>No conceptual questions generated.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Stats Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Stats Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={18} color="var(--primary)" /> Content Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Total MCQs', value: content.mcqs?.length || 0, icon: Brain, color: 'var(--success)' },
                  { label: 'Q&A Pairs', value: content.questions?.length || 0, icon: MessageSquare, color: 'var(--warning)' },
                  { label: 'Summary Length', value: `${content.summary?.split(' ').length || 0} words`, icon: FileText, color: 'var(--primary)' },
                  { label: 'Reading Time', value: `${Math.ceil((content.originalText?.length || 0) / 1000)} min`, icon: Clock, color: 'var(--secondary)' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ 
                        width: 28, height: 28, borderRadius: 6, background: `${color}15`, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        <Icon size={14} color={color} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card" style={{ padding: '24px', background: 'var(--primary)', color: 'white' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Ready for a Challenge?</h3>
              <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 20 }}>
                Test your understanding of &ldquo;{content.title}&rdquo; with our AI-powered quiz.
              </p>
              <Link href={`/quiz/${content._id}`} className="btn" style={{ 
                width: '100%', background: 'white', color: 'var(--primary)', fontWeight: 700, 
                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <PlayCircle size={18} /> Start Quiz Now
              </Link>
            </div>

            {/* Original Text Disclosure */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Original Material</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                View the raw text extracted from the uploaded PDF document.
              </p>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', fontSize: 13, gap: 8 }}
                onClick={() => {
                  const win = window.open('', '_blank');
                  win.document.write(`<pre style="white-space: pre-wrap; font-family: sans-serif; padding: 40px; line-height: 1.6;">${content.originalText}</pre>`);
                }}
              >
                <ExternalLink size={14} /> Open Raw Text
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
