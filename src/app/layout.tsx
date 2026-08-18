// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Manrope, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/layout/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'SkyPulse PRO — Weather Intelligence Engine',
  description:
    'SkyPulse PRO is a premium weather intelligence platform providing 24-hour hourly forecasts, 7-day predictions, air quality metrics, radar map, activity advisor, outfit advisor, and city comparison.',
  keywords: ['SkyPulse PRO', 'Weather Intelligence', 'Activity Advisor', 'Outfit Advisor', 'Air Quality', 'Weather Map', 'PWA'],
  authors: [{ name: 'SkyPulse Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SkyPulse PRO',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#060b19',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-[#060b19] text-slate-100 antialiased selection:bg-[#4FC3F7] selection:text-slate-950 pb-24 font-sans" suppressHydrationWarning>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
