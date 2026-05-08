import type { Metadata } from 'next';
import './globals.css';
import { NavProvider } from '@/context/NavContext';
import CustomCursor from '@/components/ui/CustomCursor';
import NoiseCanvas from '@/components/ui/NoiseCanvas';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Corps Arena — Built for the Arena',
  description: 'The competitive platform for elite performers. Qualify. Compete. Rise.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavProvider>
          <CustomCursor />
          <NoiseCanvas />
          <div id="page-transition" />
          <Navbar />
          <main>{children}</main>
          <ScrollReveal />
        </NavProvider>
      </body>
    </html>
  );
}
