import { Suspense } from 'react';
import NewsList from '@/components/news/NewsList';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="stage" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="label mono" style={{ color: 'var(--cyn)' }}>
            ::: INITIALIZING FEED :::
          </div>
        </div>
      }
    >
      <NewsList />
    </Suspense>
  );
}
