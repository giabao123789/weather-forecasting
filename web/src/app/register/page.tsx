import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new account to save your weather search history.',
};

export default function RegisterPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-accent">
          Build Your Forecast Portfolio
        </div>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Create your account and turn each forecast lookup into searchable history.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Registration is lightweight: name, email, password. The backend hashes
            your password with bcrypt and returns a JWT so you can move straight to
            the dashboard.
          </p>
        </div>
      </div>
      <AuthForm mode="register" />
    </section>
  );
}
