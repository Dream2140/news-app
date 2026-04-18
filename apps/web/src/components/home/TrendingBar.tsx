'use client';

import Link from 'next/link';
import { catColor, getCategory } from '@/lib/categories';
import type { INews } from '@newsapp/shared';

interface TrendingBarProps {
  items: INews[];
}

export default function TrendingBar({ items }: TrendingBarProps) {
  if (items.length === 0) return null;

  return (
    <section className="trending-bar">
      <div className="trending-label">
        <span style={{ color: 'var(--mag)' }}>▲</span> TRENDING
        <span className="mono" style={{ color: 'var(--ink-ghost)' }}>
          / top-{items.length}
        </span>
      </div>
      <div className="trending-items">
        {items.map((it, i) => (
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
  );
}
