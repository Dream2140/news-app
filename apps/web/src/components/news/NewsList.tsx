'use client';

import { useSearchParams } from 'next/navigation';
import HomeHero from '@/components/home/HomeHero';
import TrendingBar from '@/components/home/TrendingBar';
import MainFeed from '@/components/home/MainFeed';
import WorldMap from '@/components/home/WorldMap';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import { useNewsFeed } from '@/hooks/useNewsFeed';
import { NewsCategory } from '@newsapp/shared';

export default function NewsList() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? NewsCategory.ALL;

  const { docs, hasNextPage, isLoading, error, loadMore, retry } = useNewsFeed({ category });

  const heroItem = docs[0];
  const sideItems = docs.slice(1, 3);
  const trendingItems = docs.slice(0, 5);
  const gridItems = docs.slice(3);
  const showSkeleton = isLoading && docs.length === 0;

  return (
    <div className="stage" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <HomeHero category={category} hero={heroItem} side={sideItems} loading={showSkeleton} />

      {error && (
        <div className="frame" style={{ padding: 16, marginBottom: 16, color: 'var(--red)' }}>
          <div className="corner-bl" />
          <div className="corner-br" />
          {error}{' '}
          <button className="btn btn-cyn" style={{ marginLeft: 12 }} onClick={retry}>
            RETRY ↻
          </button>
        </div>
      )}

      <TrendingBar items={trendingItems} />

      <MainFeed
        items={gridItems}
        loading={showSkeleton}
        hasNextPage={hasNextPage}
        onLoadMore={loadMore}
        totalCount={docs.length}
      />

      <div className="sec-head" style={{ marginTop: 48 }}>
        <span className="sec-num">§ 02</span>
        <h2 className="sec-title">ГЛОБАЛЬНЫЙ ХИТМАП</h2>
      </div>
      <WorldMap />

      <CategoriesGrid />
    </div>
  );
}
