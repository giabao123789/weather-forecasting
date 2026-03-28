import { Clock3, MapPin } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { SearchHistoryItem } from '@/types';

type SearchHistoryListProps = {
  history: SearchHistoryItem[];
};

export function SearchHistoryList({ history }: SearchHistoryListProps) {
  if (!history.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-lg font-medium text-white">No history yet.</p>
        <p className="mt-2 text-sm text-muted">
          Go back to the home page, search for a city, and this list will update.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Recent searches</h2>
          <p className="mt-1 text-sm text-muted">
            Stored in MongoDB Atlas and returned from the NestJS API.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-accent-soft">
          History log
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft/12 text-accent-soft">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">{item.city}</p>
                <p className="text-sm text-muted">Saved weather lookup</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted">
              <Clock3 className="h-4 w-4" />
              {formatDateTime(item.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
