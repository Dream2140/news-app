import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { News } from '../../news/schemas/news.schema';

const CURRENTS_API_URL = 'https://api.currentsapi.services/v1/latest-news';
const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/1a1a2e/e94560?text=No+Image';

const CATEGORY_MAP: Record<string, string> = {
  technology: 'technology',
  science: 'technology',
  sports: 'cybersport',
  gaming: 'cybersport',
  politics: 'politic',
  world: 'politic',
  entertainment: 'entertainment',
  lifestyle: 'entertainment',
  health: 'health',
};

function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  if (!url || url === 'None' || url === 'null' || url.length < 10) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface CurrentsArticle {
  title: string;
  description: string;
  published: string;
  image: string;
  url: string;
  category: string[];
}

@Injectable()
export class CurrentsProvider {
  private readonly logger = new Logger(CurrentsProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async fetchNews(): Promise<Partial<News>[]> {
    const apiKey = this.configService.get<string>('CURRENTS_API_KEY');
    if (!apiKey) {
      this.logger.warn('CURRENTS_API_KEY not configured, skipping');
      return [];
    }

    try {
      const response = await axios.get(CURRENTS_API_URL, {
        timeout: 15000,
        params: { apiKey, language: 'en' },
      });

      const articles: CurrentsArticle[] | undefined = response.data?.news;
      if (!Array.isArray(articles)) {
        this.logger.warn('Currents API returned no articles');
        return [];
      }

      const results: Partial<News>[] = [];

      for (const article of articles) {
        const publishedAt = Date.parse(article.published);
        if (isNaN(publishedAt) || !article.title?.trim()) continue;

        const text = article.description?.trim() ?? '';
        const apiCategory = article.category?.[0]?.toLowerCase() ?? 'technology';
        const category = CATEGORY_MAP[apiCategory] ?? 'technology';

        results.push({
          title: article.title.trim(),
          publishedAt,
          text,
          slug: this.urlToSlug(article.url),
          image: isValidImageUrl(article.image) ? article.image : PLACEHOLDER_IMAGE,
          category,
          source: 'currents',
          readingTime: calcReadingTime(text),
        });
      }

      return results;
    } catch (error) {
      this.logger.error(`Currents API fetch failed: ${error}`);
      return [];
    }
  }

  private urlToSlug(url: string): string {
    try {
      return new URL(url).pathname.split('/').filter(Boolean).pop() ?? '';
    } catch {
      return '';
    }
  }
}
