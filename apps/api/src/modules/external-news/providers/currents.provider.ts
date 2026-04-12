import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { News } from '../../news/schemas/news.schema';

const CURRENTS_API_URL = 'https://api.currentsapi.services/v1/latest-news';

@Injectable()
export class CurrentsProvider {
  private readonly logger = new Logger(CurrentsProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async fetchNews(): Promise<Partial<News>[]> {
    const apiKey = this.configService.get<string>('CURRENTS_API_KEY');
    if (!apiKey) {
      this.logger.warn('CURRENTS_API_KEY not configured, skipping Currents API fetch');
      return [];
    }

    try {
      const response = await axios.get(CURRENTS_API_URL, {
        timeout: 15000,
        params: {
          apiKey,
          language: 'en',
          category: 'technology',
        },
      });

      const articles = response.data?.news;
      if (!Array.isArray(articles)) {
        this.logger.warn('Currents API returned no articles');
        return [];
      }

      return articles.map(
        (article: {
          title: string;
          description: string;
          published: string;
          image: string;
          url: string;
          category: string[];
        }) => ({
          title: article.title,
          publishedAt: Date.parse(article.published),
          text: article.description ?? '',
          slug: this.urlToSlug(article.url),
          image: article.image !== 'None' ? article.image : '',
          category: 'technology',
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to fetch from Currents API: ${error}`);
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
