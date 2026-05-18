'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Brain, Mail, Lock, User, ArrowRight, GraduationCap, BookOpen } from 'lucide-react';
import { registerSchema } from '@/lib/validations';
import { useAuth } from '@/store/AuthContext';
import { getErrorMessage } from '@/lib/api';

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Take quizzes & track progress' },
  { value: 'teacher', label: 'Teacher', icon: BookOpen, desc: 'Upload PDFs & generate content' },
];

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created! Welcome to EduAI 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--background)', padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 520 }} className="animate-fadeIn">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={24} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800 }}>EduAI</span>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Join thousands of learners on EduAI
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input {...register('name')} type="text" placeholder="John Doe" className="input" style={{ paddingLeft: 40 }} />
              </div>
              {errors.name && <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 5 }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input {...register('email')} type="email" placeholder="you@example.com" className="input" style={{ paddingLeft: 40 }} />
              </div>
              {errors.email && <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 5 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="input"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 5 }}>{errors.password.message}</p>}
            </div>

            {/* Role selection */}
            <div>
              <label className="label">I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {roles.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('role', value)}
                    style={{
                      padding: '16px 14px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                      border: `2px solid ${selectedRole === value ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedRole === value ? 'var(--primary-light)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={20} color={selectedRole === value ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: 8 }} />
                    <div style={{ fontWeight: 700, fontSize: 14, color: selectedRole === value ? 'var(--primary)' : 'var(--foreground)' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                  </button>
                ))}
              </div>
              {errors.role && <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 5 }}>{errors.role.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 48, fontSize: 15, marginTop: 6 }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
