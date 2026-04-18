'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { CATEGORIES, catColor, catName, timeAgo } from '@/lib/categories';
import { NewsCategory } from '@newsapp/shared';
import type { INews } from '@newsapp/shared';

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [docs, setDocs] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localQ, setLocalQ] = useState(query);
  const [filter, setFilter] = useState<string>(NewsCategory.ALL);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/news/get-news-by-title', {
          params: { title: query },
        });
        if (!cancelled) setDocs(res.data.data);
      } catch {
        if (!cancelled) setDocs([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const hasQuery = !!query;

  const filtered = useMemo(() => {
    if (!hasQuery) return [];
    if (filter === NewsCategory.ALL) return docs;
    return docs.filter((d) => d.category === filter);
  }, [docs, filter, hasQuery]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localQ.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="stage search-wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="sec-head">
        <span className="sec-num">§ SEARCH</span>
        <h2 className="sec-title">ТЕРМИНАЛ</h2>
      </div>

      <form onSubmit={submit} className="search-bar frame">
        <div className="corner-bl" />
        <div className="corner-br" />
        <span className="mono" style={{ color: 'var(--cyn)', fontSize: 18 }}>
          ›
        </span>
        <input
          className="search-input"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder="search // поиск по базе сигналов"
          autoFocus
        />
        <button type="submit" className="btn btn-mag">
          EXECUTE ↗
        </button>
      </form>

      {/* FILTER CHIPS */}
      <div className="seg-row">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={'seg' + (filter === c.id ? ' active' : '')}
            style={{ ['--cat' as string]: c.color }}
            onClick={() => setFilter(c.id)}
          >
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>
              {c.jp}
            </span>
            <span>{c.ru.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className="label mono" style={{ margin: '20px 0 12px' }}>
        {isLoading
          ? '::: SCANNING BASE :::'
          : query
            ? `${filtered.length} signals for "${query}"`
            : 'enter query to begin scan'}
      </div>

      {!isLoading && filtered.length === 0 && query && (
        <div className="frame" style={{ padding: 32, textAlign: 'center' }}>
          <div className="corner-bl" />
          <div className="corner-br" />
          <div className="display" style={{ fontSize: 22, color: 'var(--red)' }}>
            NO SIGNAL
          </div>
          <div className="label mono" style={{ marginTop: 8, color: 'var(--ink-dim)' }}>
            ничего не найдено · попробуйте другой запрос
          </div>
        </div>
      )}

      <div className="search-rows">
        {filtered.map((item, i) => (
          <Link key={item._id} href={`/news/${item._id}`} className="search-row frame">
            <div className="corner-bl" />
            <div className="corner-br" />
            <span className="search-num">{String(i + 1).padStart(3, '0')}</span>
            <div className="search-thumb ph">
              {item.image && isValidUrl(item.image) ? (
                <Image src={item.image} alt="" fill sizes="120px" style={{ objectFit: 'cover' }} />
              ) : (
                <span>◫</span>
              )}
            </div>
            <div className="search-body">
              <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="chip" style={{ color: catColor(item.category) }}>
                  <span className="chip-dot" />
                  {catName(item.category)}
                </span>
                <span className="label mono" style={{ color: 'var(--ink-dim)' }}>
                  · {timeAgo(item.publishedAt)}
                </span>
              </div>
              <div className="search-title">{item.title}</div>
              <div className="search-excerpt">{item.text.slice(0, 160)}…</div>
            </div>
            <div className="search-stats">
              <div className="label">READ</div>
              <div className="display" style={{ fontSize: 18, color: 'var(--yel)' }}>
                {item.readingTime}м
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
