import Image from 'next/image';
import Link from 'next/link';
import CommentsList from '@/components/comments/CommentsList';
import ShareButtons from '@/components/news/ShareButtons';
import NewsCard from '@/components/news/NewsCard';
import { apiClient } from '@/lib/api-client';
import { catColor, catName, timeAgo, fmtNum } from '@/lib/categories';
import type { INews } from '@newsapp/shared';

export const revalidate = 300;

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function getNews(id: string): Promise<INews | null> {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  try {
    const response = await apiClient.get(`/news/get-news-by-id/${id}`);
    return response.data.data;
  } catch {
    return null;
  }
}

async function getRelated(id: string): Promise<INews[]> {
  try {
    const response = await apiClient.get(`/news/related/${id}`);
    return response.data.data ?? [];
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const [news, related] = await Promise.all([getNews(id), getRelated(id)]);

  if (!news) {
    return (
      <div className="stage" style={{ paddingTop: 80, textAlign: 'center' }}>
        <div className="big-code" data-text="404">
          404
        </div>
        <div className="display" style={{ fontSize: 28, marginTop: 20 }}>
          SIGNAL LOST
        </div>
        <div className="label mono" style={{ marginTop: 8, color: 'var(--ink-dim)' }}>
          запрашиваемый сигнал не найден в базе
        </div>
        <Link href="/" className="btn btn-cyn" style={{ marginTop: 24 }}>
          ← BACK TO FEED
        </Link>
      </div>
    );
  }

  const hasImg = !!(news.image && isValidUrl(news.image));
  const date = new Date(news.publishedAt);
  const dateStr = date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const views = 8400 + (news._id?.length ?? 0) * 317;

  return (
    <div className="stage article-wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
      {/* BREADCRUMBS */}
      <nav className="breadcrumbs mono">
        <Link href="/">HOME</Link>
        <span className="sep">/</span>
        <Link href={`/?category=${news.category}`} style={{ color: catColor(news.category) }}>
          {catName(news.category).toUpperCase()}
        </Link>
        <span className="sep">/</span>
        <span style={{ color: 'var(--ink-ghost)' }}>{news.title.slice(0, 48)}…</span>
      </nav>

      {/* ARTICLE HERO */}
      <div className="article-hero frame">
        <div className="corner-bl" />
        <div className="corner-br" />
        {hasImg ? (
          <div className="article-hero-img">
            <Image
              src={news.image}
              alt={news.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="article-hero-grad" />
          </div>
        ) : (
          <div className="article-hero-img ph">
            <span>SIGNAL // NO IMAGE</span>
          </div>
        )}

        <div className="article-hero-body">
          <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="chip" style={{ color: catColor(news.category) }}>
              <span className="chip-dot" />
              {catName(news.category)}
            </span>
            <span className="chip chip-live">
              <span className="chip-dot" />
              BREAKING
            </span>
            <span className="label mono" style={{ color: 'var(--ink-dim)' }}>
              · {timeAgo(news.publishedAt)} назад
            </span>
          </div>
          <h1 className="article-title glitch" data-text={news.title}>
            {news.title}
          </h1>
        </div>
      </div>

      {/* ARTICLE LAYOUT */}
      <div className="article-layout">
        <aside className="article-rail">
          <div className="rail-item">
            <div className="label">VIEWS</div>
            <div className="display" style={{ fontSize: 22, color: 'var(--cyn)' }}>
              {fmtNum(views)}
            </div>
          </div>
          <div className="rail-item">
            <div className="label">READ</div>
            <div className="display" style={{ fontSize: 22, color: 'var(--yel)' }}>
              {news.readingTime}м
            </div>
          </div>
          <div className="rail-item">
            <div className="label">DATE</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-dim)' }}>
              {dateStr}
              <br />
              {timeStr}
            </div>
          </div>
          {news.source && (
            <div className="rail-item">
              <div className="label">SOURCE</div>
              <div
                className="mono"
                style={{ fontSize: 11, color: 'var(--mag)', wordBreak: 'break-all' }}
              >
                {news.source.toUpperCase()}
              </div>
            </div>
          )}
          <ShareButtons title={news.title} />
        </aside>

        <article className="article-body">
          <p className="lede">
            {news.text
              .split(/\n\n|(?<=\.)\s+/)
              .slice(0, 1)
              .join('')}
          </p>
          <div className="article-text">
            {news.text
              .split(/\n\n/)
              .slice(1)
              .map((para: string, i: number) =>
                para.length > 120 && i === 1 ? (
                  <blockquote key={i} className="pullquote">
                    {para}
                  </blockquote>
                ) : (
                  <p key={i}>{para}</p>
                ),
              )}
          </div>
          <div className="tags">
            <Link href={`/?category=${news.category}`} className="tag">
              # {catName(news.category)}
            </Link>
            {news.source && <span className="tag">@ {news.source}</span>}
            <span className="tag">⊙ {news.readingTime} МИН</span>
          </div>
        </article>
      </div>

      {/* COMMENTS */}
      <div className="sec-head" style={{ marginTop: 48 }}>
        <span className="sec-num">§ COMMENTS</span>
        <h2 className="sec-title">ТЕРМИНАЛ ОТКЛИКА</h2>
      </div>
      <CommentsList newsId={id} />

      {/* RELATED */}
      {related.length > 0 && (
        <>
          <div className="sec-head" style={{ marginTop: 48 }}>
            <span className="sec-num">§ RELATED</span>
            <h2 className="sec-title">СМЕЖНЫЕ СИГНАЛЫ</h2>
          </div>
          <div className="feed-grid">
            {related.slice(0, 4).map((item: INews) => (
              <NewsCard
                key={item._id}
                href={`/news/${item._id}`}
                imageUrl={item.image}
                title={item.title}
                category={item.category}
                readingTime={item.readingTime}
                source={item.source}
                publishedAt={item.publishedAt}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
