'use client';

import NewsCard from '@/components/news/NewsCard';
import { getCategory } from '@/lib/categories';
import type { INews } from '@newsapp/shared';

interface HomeHeroProps {
  category: string;
  hero: INews | undefined;
  side: INews[];
  loading: boolean;
}

export default function HomeHero({ category, hero, side, loading }: HomeHeroProps) {
  const activeCat = getCategory(category);

  return (
    <section className="hero-sec">
      <div className="hero-head">
        <span className="chip" style={{ color: activeCat.color }}>
          <span className="chip-dot" />
          {activeCat.jp} {'//'} {activeCat.ru.toUpperCase()}
        </span>
        <span className="label mono">§ 00 · TOP SIGNAL</span>
      </div>
      <h1 className="hero-title glitch" data-text="DREAM NEWS">
        DREAM NEWS
      </h1>
      <div className="hero-title-2">БУДУЩЕЕ УЖЕ ЗДЕСЬ</div>
      <p className="hero-sub">
        Агрегатор сигналов — технологии, киберспорт, политика, культура. Только важное, только
        сейчас.
      </p>

      <div className="hero-grid">
        <div>
          {loading || !hero ? (
            <NewsCard loading variant="hero" />
          ) : (
            <NewsCard
              variant="hero"
              href={`/news/${hero._id}`}
              imageUrl={hero.image}
              title={hero.title}
              description={hero.text}
              category={hero.category}
              readingTime={hero.readingTime}
              source={hero.source}
              publishedAt={hero.publishedAt}
            />
          )}
        </div>
        <div className="hero-side">
          {loading
            ? [0, 1].map((i) => <NewsCard key={i} loading variant="wide" />)
            : side.map((item) => (
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
                />
              ))}
        </div>
      </div>
    </section>
  );
}
