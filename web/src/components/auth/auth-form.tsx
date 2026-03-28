'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { loginUser, registerUser } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

type AuthFormProps = {
  mode: 'login' | 'register';
};

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === 'register';
  const router = useRouter();
  const { persistAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isRegister && !formData.name.trim()) {
      setError('Please provide your name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = isRegister
        ? await registerUser({
            name: formData.name.trim(),
            email: formData.email,
            password: formData.password,
          })
        : await loginUser({
            email: formData.email,
            password: formData.password,
          });

      persistAuth(response);
      router.push('/dashboard');
      router.refresh();
    } catch (authError) {
      setError(
        getErrorMessage(authError, 'Unable to complete authentication right now.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.28em] text-accent-soft">
          {isRegister ? 'Register account' : 'Member login'}
        </p>
        <h2 className="text-3xl font-semibold text-white">
          {isRegister ? 'Create your weather account' : 'Welcome back'}
        </h2>
        <p className="text-sm leading-7 text-muted">
          {isRegister
            ? 'Your token is stored locally after signup so you can start using the dashboard immediately.'
            : 'Sign in with the same email and password you registered with.'}
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {isRegister ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Name</span>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Your full name"
                className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 text-sm text-white outline-none placeholder:text-muted focus:border-accent-soft focus:shadow-[0_0_0_4px_rgba(83,216,255,0.12)]"
              />
            </div>
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="you@example.com"
              className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 text-sm text-white outline-none placeholder:text-muted focus:border-accent-soft focus:shadow-[0_0_0_4px_rgba(83,216,255,0.12)]"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="password"
              value={formData.password}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Minimum 6 characters"
              className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 text-sm text-white outline-none placeholder:text-muted focus:border-accent-soft focus:shadow-[0_0_0_4px_rgba(83,216,255,0.12)]"
            />
          </div>
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-soft px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? isRegister
              ? 'Creating account...'
              : 'Signing in...'
            : isRegister
              ? 'Create account'
              : 'Login'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link
          href={isRegister ? '/login' : '/register'}
          className="font-medium text-accent-soft hover:text-white"
        >
          {isRegister ? 'Go to login' : 'Create one now'}
        </Link>
      </p>
    </div>
  );
}
