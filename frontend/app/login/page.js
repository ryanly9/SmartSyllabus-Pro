'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Brain, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { loginSchema } from '@/lib/validations';
import { useAuth } from '@/store/AuthContext';
import { getErrorMessage } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user?.name?.split(' ')[0] || 'there'}! 🎉`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--background)',
    }}>
      {/* Left panel – decorative */}
      <div style={{
        display: 'none',
        flex: 1, background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        position: 'relative', overflow: 'hidden', padding: 60,
        flexDirection: 'column', justifyContent: 'center',
      }} className="lg:flex lg:flex-col">
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(108,99,255,0.2)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(0,212,170,0.15)', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={26} color="white" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>EduAI</span>
          </div>

          <h1 style={{ fontSize: 42, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
            Learn Smarter<br />with <span style={{ color: 'var(--secondary)' }}>AI Power</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 420 }}>
            Transform your PDFs into structured notes, summaries, and quizzes in seconds.
            Powered by the latest AI technology.
          </p>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📄', text: 'Upload any PDF and extract key insights' },
              { icon: '🧠', text: 'AI generates notes, summaries & quizzes' },
              { icon: '📊', text: 'Track learning progress with analytics' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – login form */}
      <div style={{
        flex: '0 0 100%', maxWidth: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }} className="lg:flex-none lg:w-[480px] lg:max-w-[480px]">
        <div style={{ width: '100%', maxWidth: 420 }} className="animate-fadeIn">
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }} className="lg:hidden">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={22} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>EduAI</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)', marginBottom: 8 }}>
              Welcome back 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Sign in to your account to continue learning
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                  style={{ paddingLeft: 40 }}
                />
              </div>
              {errors.email && (
                <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 6 }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="label" style={{ marginBottom: 0 }}>Password</label>
                <Link href="#" style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 6 }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ height: 48, fontSize: 15, marginTop: 4 }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>



            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
