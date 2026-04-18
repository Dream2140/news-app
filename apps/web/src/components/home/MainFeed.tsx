'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from '@/components/news/NewsCard';
import LivePanel from '@/components/home/LivePanel';
import type { INews } from '@newsapp/shared';

interface MainFeedProps {
  items: INews[];
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  totalCount: number;
}

export default function MainFeed({
  items,
  loading,
  hasNextPage,
  onLoadMore,
  totalCount,
}: MainFeedProps) {
  return (
    <>
      <div className="sec-head">
        <span className="sec-num">§ 01</span>
        <h2 className="sec-title">ОСНОВНАЯ ЛЕНТА</h2>
        <span className="label mono" style={{ color: 'var(--ink-dim)' }}>
          {totalCount} signals loaded
        </span>
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          {loading ? (
            <div className="feed-grid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <NewsCard key={i} loading />
              ))}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={items.length}
              next={onLoadMore}
              hasMore={hasNextPage}
              loader={
                <div className="label mono" style={{ padding: 16, textAlign: 'center' }}>
                  ::: LOADING MORE SIGNALS :::
                </div>
              }
              endMessage={
                <div
                  className="label mono"
                  style={{ padding: 16, textAlign: 'center', color: 'var(--ink-ghost)' }}
                >
                  ◼ END OF FEED // все сигналы обработаны
                </div>
              }
            >
              <div className="feed-grid">
                {items.map((item) => (
                  <NewsCard
                    key={item._id}
                    href={`/news/${item._id}`}
                    imageUrl={item.image}
                    title={item.title}
                    description={item.text}
                    category={item.category}
                    readingTime={item.readingTime}
                    source={item.source}
                    publishedAt={item.publishedAt}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>

        <aside className="feed-aside">
          <LivePanel />
        </aside>
      </div>
    </>
  );
}
