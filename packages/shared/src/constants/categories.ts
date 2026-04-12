export enum NewsCategory {
  ALL = 'all',
  CYBERSPORT = 'cybersport',
  POLITIC = 'politic',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
}

export const NEWS_CATEGORIES = [
  { id: 1, name: 'All', type: NewsCategory.ALL },
  { id: 2, name: 'Cybersport', type: NewsCategory.CYBERSPORT },
  { id: 3, name: 'Politic', type: NewsCategory.POLITIC },
  { id: 4, name: 'Entertainment', type: NewsCategory.ENTERTAINMENT },
  { id: 5, name: 'Health', type: NewsCategory.HEALTH },
] as const;
