import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="stage" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="label mono" style={{ color: 'var(--cyn)' }}>
            ::: BOOTING TERMINAL :::
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
