import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Orbitron, Rajdhani, JetBrains_Mono, Noto_Sans_JP } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider from '@/theme/ThemeProvider';
import AuthProvider from '@/contexts/AuthContext';
import SnackbarProvider from '@/contexts/SnackbarContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Ticker from '@/components/layout/Ticker';
import FxLayers from '@/components/fx/FxLayers';
import RainCanvas from '@/components/fx/RainCanvas';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});
const rajdhani = Rajdhani({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const notoJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEURO.NEWS — Neo-Tokyo Media Relay',
  description: 'Нейросеть агрегирует сигналы с 4 218 источников в реальном времени.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${orbitron.variable} ${rajdhani.variable} ${jetbrains.variable} ${notoJp.variable}`;
  return (
    <html lang="en" className={fontVars}>
      <body>
        <RainCanvas />
        <FxLayers />
        <AppRouterCacheProvider>
          <ThemeProvider>
            <AuthProvider>
              <SnackbarProvider>
                <Suspense fallback={<div style={{ height: 120 }} />}>
                  <Header />
                </Suspense>
                <Ticker />
                <main>{children}</main>
                <Footer />
              </SnackbarProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
