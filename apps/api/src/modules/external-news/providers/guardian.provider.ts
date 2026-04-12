import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { News } from '../../news/schemas/news.schema';

const GUARDIAN_API_URL = 'https://content.guardianapis.com/search';

function formatUrlString(str: string): string {
  return str.split('/').pop() ?? str;
}

@Injectable()
export class GuardianProvider {
  private readonly logger = new Logger(GuardianProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async fetchNews(): Promise<Partial<News>[]> {
    const apiKey = this.configService.get<string>('GUARDIAN_API_KEY');
    if (!apiKey) {
      this.logger.warn('GUARDIAN_API_KEY not configured');
      return [];
    }

    const response = await axios.get(GUARDIAN_API_URL, {
      timeout: 10000,
      params: {
        'api-key': apiKey,
        'page-size': 100,
        'show-fields': 'headline,bodyText,thumbnail',
        'show-tags': 'keyword',
      },
    });

    const results = response.data?.response?.results;
    if (!Array.isArray(results)) return [];

    return results.map(
      (result: {
        webTitle: string;
        webPublicationDate: string;
        id: string;
        fields: { bodyText: string; thumbnail: string };
      }) => ({
        title: result.webTitle,
        publishedAt: Date.parse(result.webPublicationDate),
        text: result.fields?.bodyText ?? '',
        slug: formatUrlString(result.id),
        image: result.fields?.thumbnail ?? '',
        category: ['politic'],
      }),
    );
  }
}
