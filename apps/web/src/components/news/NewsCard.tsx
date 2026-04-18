'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { catColor, catName, timeAgo, fmtNum } from '@/lib/categories';

interface NewsCardProps {
  loading?: boolean;
  href?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  readingTime?: number;
  source?: string;
  publishedAt?: number;
  variant?: 'default' | 'hero' | 'wide';
  breaking?: boolean;
  views?: number;
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function NewsCard({
  loading,
  href,
  imageUrl,
  title,
  description,
  category,
  readingTime,
  source,
  publishedAt,
  variant = 'default',
  breaking = false,
  views,
}: NewsCardProps) {
  const [imgError, setImgError] = useState(false);

  const content = (
    <>
      <span className="tick tl" />
      <span className="tick tr" />
      <span className="tick bl" />
      <span className="tick br" />

      <div className="card-img ph">
        {!loading && imageUrl && isValidUrl(imageUrl) && !imgError ? (
          <Image
            src={imageUrl}
            alt={title ?? 'news'}
            fill
            sizes={variant === 'hero' ? '100vw' : '(max-width: 720px) 100vw, 400px'}
            style={{ objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{loading ? 'LOADING // SIGNAL' : 'SIGNAL // NO IMAGE'}</span>
        )}

        {!loading && (
          <div className="card-meta">
            {category && (
              <span className="chip" style={{ color: catColor(category) }}>
                <span className="chip-dot" />
                {catName(category)}
              </span>
            )}
            {breaking && (
              <span className="chip chip-live">
                <span className="chip-dot" />
                BREAKING
              </span>
            )}
          </div>
        )}

        {!loading && readingTime ? <div className="ph-label mono">⊙ {readingTime} мин</div> : null}
      </div>

      <div className="card-body">
        {loading ? (
          <>
            <div
              style={{
                height: 20,
                background: 'var(--bg-2)',
                width: '85%',
                marginBottom: 6,
              }}
            />
            <div style={{ height: 20, background: 'var(--bg-2)', width: '60%' }} />
          </>
        ) : (
          <>
            <h3 className="card-title">{title}</h3>
            {description && (variant === 'hero' || variant === 'wide') && (
              <p className="card-excerpt">{description}</p>
            )}
            <div className="card-foot">
              <span>
                {source ? source.toUpperCase() : '—'}
                {publishedAt ? ' · ' + timeAgo(publishedAt) : ''}
              </span>
              {views !== undefined && (
                <span style={{ color: 'var(--cyn)' }}>▸ {fmtNum(views)}</span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );

  const className = 'news-card' + (variant !== 'default' ? ' ' + variant : '');

  if (href && !loading) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}
