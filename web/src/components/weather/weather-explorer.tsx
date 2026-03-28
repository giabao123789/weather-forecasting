'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Cloud, Compass, History, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { WeatherCard } from '@/components/weather/weather-card';
import { WeatherSearchForm } from '@/components/weather/weather-search-form';
import { WeatherSkeleton } from '@/components/weather/weather-skeleton';
import { getWeatherByCity, getWeatherByCoordinates } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { TemperatureUnit, WeatherData } from '@/types';

const DEFAULT_CITY = 'Ho Chi Minh City';
const quickCities = ['Ha Noi', 'Da Nang', 'Singapore', 'Tokyo'];

export function WeatherExplorer() {
  const { isAuthenticated, token, user } = useAuth();
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState<TemperatureUnit>('c');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(true);

  const runCitySearch = useCallback(async (selectedCity: string) => {
    const trimmedCity = selectedCity.trim();

    if (!trimmedCity) {
      setError('Please enter a city name before searching.');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const result = await getWeatherByCity(trimmedCity, token ?? undefined);
      setWeather(result);
      setCity(result.city);
    } catch (lookupError) {
      setError(getErrorMessage(lookupError, 'Unable to load weather data.'));
    } finally {
      setIsSearching(false);
    }
  }, [token]);

  const runLocationLookup = useCallback(async () => {
    if (!navigator.geolocation) {
      setIsLocating(false);
      await runCitySearch(DEFAULT_CITY);
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await getWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
            token ?? undefined,
          );

          setWeather(result);
          setCity(result.city);
        } catch (lookupError) {
          await runCitySearch(DEFAULT_CITY);
          setError(
            getErrorMessage(
              lookupError,
              'Location lookup failed, so a fallback city was loaded.',
            ),
          );
        } finally {
          setIsLocating(false);
        }
      },
      async () => {
        setIsLocating(false);
        await runCitySearch(DEFAULT_CITY);
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 600000,
      },
    );
  }, [runCitySearch, token]);

  useEffect(() => {
    void runLocationLookup();
  }, [runLocationLookup]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runCitySearch(city);
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.22fr_0.78fr]">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-accent-soft">
            <Sparkles className="h-4 w-4" />
            Local + Production Ready
          </div>
          <div className="mt-6 space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Full-stack weather forecasting with live search, JWT auth, and history tracking.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Search by city, auto-detect your location, switch between Celsius and
              Fahrenheit, and sync results into MongoDB when you are logged in.
            </p>
          </div>

          <div className="mt-8">
            <WeatherSearchForm
              city={city}
              isLoading={isSearching}
              isLocating={isLocating}
              onCityChange={setCity}
              onDetectLocation={() => void runLocationLookup()}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted">Quick picks:</span>
            {quickCities.map((quickCity) => (
              <button
                key={quickCity}
                type="button"
                onClick={() => void runCitySearch(quickCity)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-white/20 hover:bg-white/10"
              >
                {quickCity}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
        </div>

        {isLocating || isSearching ? (
          <WeatherSkeleton />
        ) : weather ? (
          <WeatherCard
            unit={unit}
            weather={weather}
            onUnitChange={setUnit}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center shadow-2xl shadow-black/10 backdrop-blur-xl">
            <p className="text-lg font-medium text-white">
              Start with a city search to see the latest weather.
            </p>
            <p className="mt-2 text-sm text-muted">
              The app will fetch weather data from the NestJS backend and return a
              beginner-friendly response model.
            </p>
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/15 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Auto location</h2>
              <p className="text-sm text-muted">
                Browser geolocation loads weather automatically when permission is granted.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-muted">Current session:</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {isAuthenticated ? `Signed in as ${user?.name}` : 'Guest mode'}
            </p>
            <p className="mt-2 text-sm text-muted">
              {isAuthenticated
                ? 'Every successful weather search is stored in your dashboard.'
                : 'Searches still work, but they are not persisted until you log in.'}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/15 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Built-in features</h2>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Cloud className="mt-0.5 h-5 w-5 text-accent-soft" />
              <div>
                <p className="font-medium text-white">City weather lookup</p>
                <p className="text-sm text-muted">
                  Fetches live temperature, conditions, humidity, wind speed, and icon data.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-positive" />
              <div>
                <p className="font-medium text-white">JWT-protected profile routes</p>
                <p className="text-sm text-muted">
                  Login and registration use NestJS auth with bcrypt password hashing.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <History className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="font-medium text-white">MongoDB search history</p>
                <p className="text-sm text-muted">
                  Dashboard reads your latest search activity directly from the backend.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-2xl shadow-black/15 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Next step</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Use the dashboard to confirm that JWT-protected routes, MongoDB history,
            and the profile endpoint all work end-to-end.
          </p>
          <Link
            href={isAuthenticated ? '/dashboard' : '/register'}
            className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 hover:translate-y-[-1px] hover:bg-accent"
          >
            {isAuthenticated ? 'Open dashboard' : 'Create account'}
          </Link>
        </div>
      </aside>
    </section>
  );
}
