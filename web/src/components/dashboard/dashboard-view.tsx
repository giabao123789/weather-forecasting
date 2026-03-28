'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { SearchHistoryList } from '@/components/dashboard/search-history-list';
import { useAuth } from '@/components/providers/auth-provider';
import { getProfile, getSearchHistory } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { AuthUser, SearchHistoryItem } from '@/types';

export function DashboardView() {
  const router = useRouter();
  const { isReady, logout, setSessionUser, token, user } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!token) {
      router.replace('/login');
      return;
    }

    let isMounted = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [profileResponse, historyResponse] = await Promise.all([
          getProfile(token),
          getSearchHistory(token),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(profileResponse);
        setSessionUser(profileResponse);
        setHistory(historyResponse);
      } catch (dashboardError) {
        if (!isMounted) {
          return;
        }

        const message = getErrorMessage(
          dashboardError,
          'Unable to load your dashboard right now.',
        );

        if (message.toLowerCase().includes('unauthorized')) {
          logout();
          router.replace('/login');
          return;
        }

        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isReady, logout, router, setSessionUser, token]);

  if (!isReady || isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (!token || !profile) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-accent-soft">
            JWT Protected Dashboard
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Your weather activity at a glance
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted">
            Review your profile data and confirm that each weather search made while
            signed in is stored and returned from the backend.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh page
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <DashboardOverview
        profile={profile}
        historyCount={history.length}
        latestSearch={history[0]}
      />

      <SearchHistoryList history={history} />
    </section>
  );
}
