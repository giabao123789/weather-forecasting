import type { Metadata } from 'next';
import { AppHeader } from '@/components/layout/app-header';
import { PageShell } from '@/components/layout/page-shell';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WeatherScope',
    template: '%s | WeatherScope',
  },
  description:
    'A full-stack weather forecast application built with Next.js, Tailwind CSS, NestJS, JWT authentication, and MongoDB Atlas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <PageShell>{children}</PageShell>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
