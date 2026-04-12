import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider from '@/theme/ThemeProvider';
import AuthProvider from '@/contexts/AuthContext';
import SnackbarProvider from '@/contexts/SnackbarContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Dream News — Tech & Esports',
  description: 'Your daily source for technology, cybersport, and gaming news',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <AuthProvider>
              <SnackbarProvider>
                <Header />
                <main style={{ marginTop: 64, minHeight: 'calc(100vh - 164px)' }}>{children}</main>
                <Footer />
              </SnackbarProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
