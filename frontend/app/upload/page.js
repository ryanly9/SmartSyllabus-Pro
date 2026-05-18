'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import FileUpload from '@/components/shared/FileUpload';
import { uploadAPI, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  FileText, Sparkles, Brain, CheckCircle2, 
  ArrowRight, Loader2, Info, ChevronRight,
  ShieldCheck, Zap, Repeat
} from 'lucide-react';

const STAGES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error'
};

export default function UploadPage() {
  const router = useRouter();
  const { isTeacher } = useAuth();
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState(STAGES.IDLE);
  const [progress, setProgress] = useState(0);
  const [contentId, setContentId] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');

  const handleProcess = async () => {
    if (!file) return toast.error('Please select a PDF file');

    try {
      // Stage 1: Upload Phase
      setStage(STAGES.UPLOADING);
      setProgress(20);
      
      const formData = new FormData();
      formData.append('pdf', file);
      if (title.trim()) formData.append('title', title);

      const uploadRes = await uploadAPI.uploadPDF(formData);
      const newContentId = uploadRes.data.data.contentId;
      setContentId(newContentId);
      
      setProgress(50);
      toast.success('Text extracted successfully!');

      // Stage 2: AI Generation Phase
      setStage(STAGES.GENERATING);
      setProgress(70);

      try {
        await uploadAPI.generateContent({ contentId: newContentId });
        setProgress(100);
        setStage(STAGES.SUCCESS);
        toast.success('AI content generated!');
      } catch (genErr) {
        // Specifically handle the "quota exceeded" or AI failure but keep the entry
        const msg = getErrorMessage(genErr);
        setErrorDetails(msg);
        setStage(STAGES.ERROR);
        setProgress(50); // Stuck at half
        toast.error('AI generation failed, but file was uploaded.');
      }

    } catch (err) {
      setStage(STAGES.ERROR);
      setErrorDetails(getErrorMessage(err));
      toast.error(getErrorMessage(err));
    }
  };

  const reset = () => {
    setFile(null);
    setTitle('');
    setStage(STAGES.IDLE);
    setProgress(0);
    setErrorDetails('');
  };

  return (
    <ProtectedRoute roles={['teacher', 'admin']}>
      <AppShell>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)', marginBottom: 8 }}>
              Generate AI Content <Sparkles size={24} color="var(--secondary)" style={{ display: 'inline', marginLeft: 8 }} />
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
              Upload your PDF documents and our AI will automatically generate structured notes, 
              concise summaries, and interactive quizzes for your students.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }} className="lg:grid lg:grid-cols-[1fr_300px] flex flex-col">
            
            {/* Main Form Area */}
            <div className="card" style={{ padding: 32 }}>
              
              {stage === STAGES.IDLE || stage === STAGES.ERROR ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  
                  {/* Title Input */}
                  <div>
                    <label className="label">Document Title (Optional)</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text"
                        placeholder="e.g., Introduction to Quantum Physics"
                        className="input"
                        style={{ paddingLeft: 40 }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={stage === STAGES.UPLOADING || stage === STAGES.GENERATING}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                      If left empty, we&apos;ll use the original PDF filename.
                    </p>
                  </div>

                  {/* File Upload Component */}
                  <div>
                    <label className="label">PDF Document</label>
                    <FileUpload onFileSelect={setFile} />
                  </div>

                  {/* Error State Info */}
                  {stage === STAGES.ERROR && (
                    <div style={{ 
                      padding: 16, background: 'var(--error-light)', 
                      borderRadius: 10, border: '1px solid rgba(244,67,54,0.2)',
                      display: 'flex', gap: 12
                    }}>
                      <Info size={20} color="var(--error)" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--error)' }}>Processing Failed</div>
                        <p style={{ fontSize: 13, color: 'var(--error)', opacity: 0.8, marginTop: 2 }}>{errorDetails}</p>
                        {errorDetails.includes('quota') && (
                          <div style={{ marginTop: 10, fontSize: 12, padding: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 6 }}>
                            <strong>Tip:</strong> Your OpenAI account has run out of funds. Please recharge at platform.openai.com.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button 
                    onClick={handleProcess}
                    disabled={!file || stage === STAGES.UPLOADING || stage === STAGES.GENERATING}
                    className="btn btn-primary"
                    style={{ height: 50, fontSize: 16, marginTop: 8 }}
                  >
                    {stage === STAGES.UPLOADING ? 'Extracting Text...' : stage === STAGES.GENERATING ? 'AI Processing...' : 'Generate Learning Content'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              ) : stage === STAGES.SUCCESS ? (
                /* Success State */
                <div style={{ textAlign: 'center', padding: '20px 0' }} className="animate-fadeIn">
                  <div style={{ 
                    width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
                  }}>
                    <CheckCircle2 size={40} color="var(--success)" />
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Content Generated!</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>
                    Your document has been processed. We&apos;ve extracted the text and generated 
                    comprehensive notes, summaries, and interactive quizzes.
                  </p>
                  
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={reset} className="btn btn-secondary">
                      <Repeat size={16} /> Upload Another
                    </button>
                    <button onClick={() => router.push(`/content/${contentId}`)} className="btn btn-primary">
                      View Content <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Loading State (Uploading/Generating) */
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 32px' }}>
                    {/* Pulsing glow */}
                    <div style={{ 
                      position: 'absolute', inset: -10, borderRadius: '50%', 
                      background: 'var(--primary)', opacity: 0.1, 
                      animation: 'pulse 2s infinite' 
                    }} />
                    
                    <div style={{ 
                      width: 120, height: 120, borderRadius: '50%', 
                      border: '4px solid var(--border)', borderTopColor: 'var(--primary)',
                      animation: 'spin 1.5s linear infinite',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ animation: 'none', transform: 'rotate(0deg)' }}>
                         {stage === STAGES.UPLOADING ? <FileText size={40} color="var(--primary)" /> : <Brain size={40} color="var(--secondary)" />}
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                    {stage === STAGES.UPLOADING ? 'Uploading & Extracting' : 'AI is Thinking...'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, maxWidth: 300, marginInline: 'auto' }}>
                    {stage === STAGES.UPLOADING 
                      ? 'We are securely uploading your PDF and extracting text data.' 
                      : 'Our AI is analyzing the content to generate notes, summaries and quizzes.'}
                  </p>

                  <div style={{ maxWidth: 300, margin: '0 auto' }}>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div className="progress-fill" style={{ width: `${progress}%`, borderRadius: 10 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>{stage === STAGES.UPLOADING ? 'Stage 1: Text Extraction' : 'Stage 2: AI Generation'}</span>
                      <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{progress}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card" style={{ padding: 20, background: 'linear-gradient(180deg, var(--card) 0%, rgba(108,99,255,0.05) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Info size={16} color="var(--primary)" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Guidelines</span>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}>
                  {[
                    { icon: ShieldCheck, text: 'Supports standard PDF files up to 10MB.' },
                    { icon: Zap, text: 'AI generation takes 30-60 seconds depending on length.' },
                    { icon: Brain, text: 'Generates 10 MCQs and 5 open-ended questions.' }
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      <item.icon size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status Hint for Quota */}
              <div className="card" style={{ padding: 20, border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                   <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>API Status: Healthy</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  AI services are currently active. If generation fails, please check your API credit balance.
                </p>
              </div>
            </div>

          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
