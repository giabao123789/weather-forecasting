import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to view your weather search history dashboard.',
};

export default function LoginPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-accent-soft">
          Secure Weather Access
        </div>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Sign in to keep every forecast search in one private dashboard.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Your account unlocks JWT-protected profile access, persistent search
            history, and a cleaner workflow when you return to the app later.
          </p>
        </div>
      </div>
      <AuthForm mode="login" />
    </section>
  );
}
