'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloudSun, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(href);
}

export function AppHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061320]/70 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-lg shadow-black/10"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-slate-950 shadow-lg shadow-accent/20">
            <CloudSun className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-white uppercase">
              WeatherScope
            </p>
            <p className="text-xs text-muted">
              Forecast, auth, and history in one stack
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  active
                    ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                    : 'text-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-accent-soft">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {user?.name ?? 'Authenticated User'}
                  </p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 hover:translate-y-[-1px] hover:bg-accent"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
