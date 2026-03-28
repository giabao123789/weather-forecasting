'use client';

import type { FormEvent } from 'react';
import { LocateFixed, Search } from 'lucide-react';

type WeatherSearchFormProps = {
  city: string;
  isLoading: boolean;
  isLocating: boolean;
  onCityChange: (value: string) => void;
  onDetectLocation: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function WeatherSearchForm({
  city,
  isLoading,
  isLocating,
  onCityChange,
  onDetectLocation,
  onSubmit,
}: WeatherSearchFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder="Search for a city, for example Ho Chi Minh City"
            className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 text-sm text-white outline-none placeholder:text-muted focus:border-accent-soft focus:shadow-[0_0_0_4px_rgba(83,216,255,0.12)]"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading || isLocating}
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-soft px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Searching...' : 'Search weather'}
        </button>
      </div>
      <button
        type="button"
        onClick={onDetectLocation}
        disabled={isLocating}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LocateFixed className="h-4 w-4" />
        {isLocating ? 'Detecting location...' : 'Use my current location'}
      </button>
    </form>
  );
}
