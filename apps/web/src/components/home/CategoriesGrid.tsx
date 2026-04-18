'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { NewsCategory } from '@newsapp/shared';

export default function CategoriesGrid() {
  return (
    <>
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
    </>
  );
}
