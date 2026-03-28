import { CalendarClock, History, UserRound } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { AuthUser, SearchHistoryItem } from '@/types';

type DashboardOverviewProps = {
  historyCount: number;
  latestSearch?: SearchHistoryItem;
  profile: AuthUser;
};

export function DashboardOverview({
  historyCount,
  latestSearch,
  profile,
}: DashboardOverviewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-[1.75rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-accent-soft">
          <UserRound className="h-5 w-5" />
          <span className="text-sm font-medium text-muted">Profile</span>
        </div>
        <p className="mt-4 text-2xl font-semibold text-white">{profile.name}</p>
        <p className="mt-1 text-sm text-muted">{profile.email}</p>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-accent">
          <History className="h-5 w-5" />
          <span className="text-sm font-medium text-muted">Saved searches</span>
        </div>
        <p className="mt-4 text-4xl font-semibold text-white">{historyCount}</p>
        <p className="mt-2 text-sm text-muted">
          Total weather searches stored for your account.
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-positive">
          <CalendarClock className="h-5 w-5" />
          <span className="text-sm font-medium text-muted">Latest activity</span>
        </div>
        <p className="mt-4 text-xl font-semibold text-white">
          {latestSearch?.city ?? 'No searches yet'}
        </p>
        <p className="mt-2 text-sm text-muted">
          {latestSearch
            ? formatDateTime(latestSearch.createdAt)
            : 'Search for weather on the home page to populate your dashboard.'}
        </p>
      </div>
    </div>
  );
}
