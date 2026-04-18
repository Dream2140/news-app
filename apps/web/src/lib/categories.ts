import { NewsCategory } from '@newsapp/shared';

export interface CategoryMeta {
  id: NewsCategory;
  name: string;
  ru: string;
  jp: string;
  color: string;
  cssVar: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: NewsCategory.ALL,
    name: 'All',
    ru: 'Все',
    jp: '全部',
    color: 'var(--cyn)',
    cssVar: '--cat-all',
  },
  {
    id: NewsCategory.CYBERSPORT,
    name: 'Cybersport',
    ru: 'Киберспорт',
    jp: 'eスポーツ',
    color: 'var(--mag)',
    cssVar: '--cat-cybersport',
  },
  {
    id: NewsCategory.TECHNOLOGY,
    name: 'Technology',
    ru: 'Технологии',
    jp: 'テクノロジー',
    color: 'var(--cyn)',
    cssVar: '--cat-technology',
  },
  {
    id: NewsCategory.POLITIC,
    name: 'Politic',
    ru: 'Политика',
    jp: '政治',
    color: 'var(--red)',
    cssVar: '--cat-politic',
  },
  {
    id: NewsCategory.ENTERTAINMENT,
    name: 'Entertainment',
    ru: 'Досуг',
    jp: '娯楽',
    color: 'var(--yel)',
    cssVar: '--cat-entertainment',
  },
  {
    id: NewsCategory.HEALTH,
    name: 'Health',
    ru: 'Здоровье',
    jp: '健康',
    color: 'var(--lim)',
    cssVar: '--cat-health',
  },
];

export function getCategory(id: string | undefined | null): CategoryMeta {
  if (!id) return CATEGORIES[0];
  const normalized = id.toLowerCase();
  return CATEGORIES.find((c) => c.id === normalized) ?? CATEGORIES[0];
}

export function catColor(id: string | undefined | null): string {
  return getCategory(id).color;
}

export function catName(id: string | undefined | null): string {
  return getCategory(id).ru;
}

export function fmtNum(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return String(n);
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + ' сек';
  const m = Math.floor(s / 60);
  if (m < 60) return m + ' мин';
  const h = Math.floor(m / 60);
  if (h < 24) return h + ' ч';
  return Math.floor(h / 24) + ' д';
}
