import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import StoreProvider from '@/store/provider';
import Header from '@/components/layout/Header';
import AppSnackbar from '@/components/ui/Snackbar';

export const metadata: Metadata = {
  title: 'Dream News',
  description: 'News aggregator application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AppRouterCacheProvider>
            <Header />
            <main style={{ marginTop: 80, minHeight: '100vh' }}>{children}</main>
            <AppSnackbar />
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
