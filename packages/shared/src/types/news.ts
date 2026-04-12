export interface INews {
  _id: string;
  title: string;
  text: string;
  publishedAt: number;
  slug: string;
  image: string;
  category: string;
  source: string;
  readingTime: number;
}

export interface CreateNewsDto {
  title: string;
  text: string;
  slug: string;
  category: string;
  image?: string;
}

export interface UpdateNewsDto {
  title?: string;
  text?: string;
  slug?: string;
  category?: string;
  image?: string;
}
