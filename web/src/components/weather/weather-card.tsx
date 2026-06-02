import Image from 'next/image';
import { CloudSun, Droplets, Gauge, Wind } from 'lucide-react';
import { formatDateTime, getDisplayedTemperature } from '@/lib/utils';
import type { TemperatureUnit, WeatherData } from '@/types';

type WeatherCardProps = {
  unit: TemperatureUnit;
  weather: WeatherData;
  onUnitChange: (unit: TemperatureUnit) => void;
  isAuthenticated: boolean;
};

export function WeatherCard({
  unit,
  weather,
  onUnitChange,
  isAuthenticated,
}: WeatherCardProps) {
  const temperature = getDisplayedTemperature(weather, unit);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_50px_140px_rgba(0,0,0,0.45)]">
      <div className="relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(83,216,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,179,71,0.16),transparent_32%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-accent-soft">
                Current conditions
              </span>
              <span className="text-sm text-muted">
                {formatDateTime(weather.searchedAt)}
              </span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-muted">
                {weather.country}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {weather.city}
              </h2>
              <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
                {weather.description.charAt(0).toUpperCase() +
                  weather.description.slice(1)}
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="text-7xl font-semibold tracking-tight text-white sm:text-8xl">
                {temperature}°
                {unit.toUpperCase()}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/35 p-1 shadow-[0_8px_30px_rgba(15,23,42,0.2)]">
                <button
                  type="button"
                  onClick={() => onUnitChange('c')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    unit === 'c'
                      ? 'bg-white text-slate-950 shadow-sm shadow-slate-950/10'
                      : 'text-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => onUnitChange('f')}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    unit === 'f'
                      ? 'bg-white text-slate-950'
                      : 'text-muted hover:text-white'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/10 px-5 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-slate-950/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <Image
                src={weather.iconUrl}
                alt={weather.condition}
                width={96}
                height={96}
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted">
                Forecast tag
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {weather.condition}
              </p>
              <p className="mt-1 text-sm text-muted">
                Lat {weather.coordinates.lat.toFixed(2)} / Lon{' '}
                {weather.coordinates.lon.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-white/10 bg-card-strong p-6 sm:grid-cols-3 sm:p-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-[1px]">
          <div className="flex items-center gap-3 text-sky-300">
            <Droplets className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Humidity</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {weather.humidity}%
          </p>
          <p className="mt-2 text-sm text-muted">Air moisture in the current area.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-[1px]">
          <div className="flex items-center gap-3 text-cyan-300">
            <Wind className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Wind speed</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {weather.windSpeedKph} km/h
          </p>
          <p className="mt-2 text-sm text-muted">Converted from the OpenWeather response.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-[1px]">
          <div className="flex items-center gap-3 text-emerald-300">
            <Gauge className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Search log</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-white">
            {isAuthenticated
              ? 'Saved automatically to your dashboard.'
              : 'Searches stay temporary until you log in.'}
          </p>
          <p className="mt-2 text-sm text-muted">
            {isAuthenticated
              ? 'This request includes your JWT and is recorded in MongoDB Atlas.'
              : 'Create an account to sync weather lookups across sessions.'}
          </p>
        </div>
      </div>

    
    </section>
  );
}
