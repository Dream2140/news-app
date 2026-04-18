'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from './NewsCard';
import LivePanel from '@/components/home/LivePanel';
import WorldMap from '@/components/home/WorldMap';
import { apiClient } from '@/lib/api-client';
import { CATEGORIES, catColor, getCategory, fmtNum } from '@/lib/categories';
import { NewsCategory } from '@newsapp/shared';
import type { INews } from '@newsapp/shared';

const LIMIT = 12;

export default function NewsList() {
  const searchParams = useSearchParams();
  const [docs, setDocs] = useState<INews[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(NewsCategory.ALL);

  useEffect(() => {
    const urlCat = searchParams.get('category') ?? NewsCategory.ALL;
    if (urlCat !== category) {
      setCategory(urlCat);
      setDocs([]);
      setPage(1);
    }
  }, [searchParams, category]);

  const fetchNews = useCallback(async (p: number, cat: string, append: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/news/get-all-news', {
        params: { page: p, limit: LIMIT, category: cat },
      });
      const data = res.data.data;
      setDocs((prev) => (append ? [...prev, ...data.docs] : data.docs));
      setHasNextPage(data.hasNextPage);
    } catch {
      setError('SIGNAL LOST // ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(page, category, page > 1);
  }, [page, category, fetchNews]);

  const activeCat = getCategory(category);
  const heroItem = docs[0];
  const wideItems = docs.slice(1, 3);
  const trendingItems = docs.slice(0, 5);
  const gridItems = docs.slice(3);
  const showSkeleton = isLoading && docs.length === 0;

  return (
    <div className="stage" style={{ paddingTop: 24, paddingBottom: 64 }}>
      {/* HERO SECTION */}
      <section className="hero-sec">
        <div className="hero-head">
          <span className="chip" style={{ color: activeCat.color }}>
            <span className="chip-dot" />
            {activeCat.jp} {'//'} {activeCat.ru.toUpperCase()}
          </span>
          <span className="label mono">§ 00 · TOP SIGNAL</span>
        </div>
        <h1 className="hero-title glitch" data-text="NEURO.NEWS">
          NEURO.NEWS
        </h1>
        <div className="hero-title-2">БУДУЩЕЕ УЖЕ ЗДЕСЬ</div>
        <p className="hero-sub">
          Нейросеть агрегирует сигналы с 4 218 источников в реальном времени. Только важное, только
          сейчас. <span style={{ color: 'var(--cyn)' }}>uplink stable · 12ms</span>
        </p>

        {error && (
          <div className="frame" style={{ padding: 16, marginBottom: 16, color: 'var(--red)' }}>
            <div className="corner-bl" />
            <div className="corner-br" />
            {error}{' '}
            <button
              className="btn btn-cyn"
              style={{ marginLeft: 12 }}
              onClick={() => fetchNews(page, category, false)}
            >
              RETRY ↻
            </button>
          </div>
        )}

        <div className="hero-grid">
          <div>
            {showSkeleton ? (
              <NewsCard loading variant="hero" />
            ) : heroItem ? (
              <NewsCard
                variant="hero"
                href={`/news/${heroItem._id}`}
                imageUrl={heroItem.image}
                title={heroItem.title}
                description={heroItem.text}
                category={heroItem.category}
                readingTime={heroItem.readingTime}
                source={heroItem.source}
                publishedAt={heroItem.publishedAt}
                breaking
                views={12480 + (heroItem._id?.length ?? 0) * 137}
              />
            ) : null}
          </div>
          <div className="hero-side">
            {showSkeleton
              ? [0, 1].map((i) => <NewsCard key={i} loading variant="wide" />)
              : wideItems.map((item, i) => (
                  <NewsCard
                    key={item._id}
                    variant="wide"
                    href={`/news/${item._id}`}
                    imageUrl={item.image}
                    title={item.title}
                    category={item.category}
                    readingTime={item.readingTime}
                    source={item.source}
                    publishedAt={item.publishedAt}
                    views={3200 + i * 840}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* TRENDING BAR */}
      {trendingItems.length > 0 && (
        <section className="trending-bar">
          <div className="trending-label">
            <span style={{ color: 'var(--mag)' }}>▲</span> TRENDING
            <span className="mono" style={{ color: 'var(--ink-ghost)' }}>
              / top-5
            </span>
          </div>
          <div className="trending-items">
            {trendingItems.map((it, i) => (
              <Link key={it._id} href={`/news/${it._id}`} className="trending-item">
                <span className="trending-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="trending-title">{it.title}</span>
                <span className="trending-cat" style={{ color: catColor(it.category) }}>
                  · {getCategory(it.category).ru}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* MAIN FEED */}
      <div className="sec-head">
        <span className="sec-num">§ 01</span>
        <h2 className="sec-title">ОСНОВНАЯ ЛЕНТА</h2>
        <span className="label mono" style={{ color: 'var(--ink-dim)' }}>
          {docs.length} signals loaded
        </span>
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          {showSkeleton ? (
            <div className="feed-grid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <NewsCard key={i} loading />
              ))}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={docs.length}
              next={() => setPage((p) => p + 1)}
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
                {gridItems.map((item, i) => (
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
                    views={800 + i * 231}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>

        <aside className="feed-aside">
          <LivePanel />
          <div className="frame aside-block">
            <div className="corner-bl" />
            <div className="corner-br" />
            <div className="aside-head">
              <span className="chip" style={{ color: 'var(--yel)' }}>
                <span className="chip-dot" />
                MOST REACTIONS
              </span>
              <span className="label mono">24H</span>
            </div>
            <div className="aside-list">
              {docs.slice(0, 5).map((d, i) => (
                <Link key={d._id} href={`/news/${d._id}`} className="aside-item">
                  <span className="aside-num" style={{ color: catColor(d.category) }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="aside-title">{d.title}</span>
                  <span className="aside-stat mono">{fmtNum(1200 + i * 847)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* WORLD MAP */}
      <div className="sec-head" style={{ marginTop: 48 }}>
        <span className="sec-num">§ 02</span>
        <h2 className="sec-title">ГЛОБАЛЬНЫЙ ХИТМАП</h2>
      </div>
      <WorldMap />

      {/* CATEGORIES GRID */}
      <div className="sec-head" style={{ marginTop: 48 }}>
        <span className="sec-num">§ 03</span>
        <h2 className="sec-title">КАНАЛЫ</h2>
      </div>
      <div className="cat-grid">
        {CATEGORIES.filter((c) => c.id !== NewsCategory.ALL).map((c) => (
          <Link
            key={c.id}
            href={`/?category=${c.id}`}
            className="cat-card frame"
            style={{ ['--cat' as string]: c.color }}
          >
            <div className="corner-bl" />
            <div className="corner-br" />
            <div className="cat-hex" />
            <div className="cat-jp">{c.jp}</div>
            <div className="cat-ru">{c.ru}</div>
            <div className="cat-en mono">{c.name.toUpperCase()}</div>
            <div className="cat-arrow">↗</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
