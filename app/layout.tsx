import type { Metadata } from 'next';
import { EB_Garamond } from 'next/font/google';
import './globals.css';
import SmoothScroller from '@/components/SmoothScroller';

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Arena - Competitive Gaming Platform',
  description:
    'A focused esports platform for competitive players, teams, and live match events.',
  keywords: ['esports', 'gaming', 'arena', 'competitive', 'tournament'],
  openGraph: {
    title: 'Arena - Competitive Gaming Platform',
    description: 'Compete, organize, and follow live esports events.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebGaramond.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#080808" />
      </head>
      <body>
        <SmoothScroller>{children}</SmoothScroller>
      </body>
    </html>
  );
}

