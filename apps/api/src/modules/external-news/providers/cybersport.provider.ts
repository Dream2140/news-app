import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { News } from '../../news/schemas/news.schema';

const CYBERSPORT_NEWS_URL =
  'https://www.cybersport.ru/api/materials?pageoffset=0&pagelimit=50&sort=-publishedAt';
const CYBERSPORT_ONE_NEWS_URL = 'https://www.cybersport.ru/api/materials/';
const CYBERSPORT_IMAGE_URL = 'https://virtus-img.cdnvideo.ru/images/material-card/plain/';
const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/1a1a2e/e94560?text=No+Image';

function cleanText(str: string): string {
  return str
    .replace(/<[^>]+>/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function isValidImagePath(path: unknown): path is string {
  return typeof path === 'string' && path.length > 5 && !path.includes('undefined');
}

interface CybersportItem {
  id: string;
  attributes: {
    title: string;
    publishedAt: number;
    slug: string;
    image: string;
  };
}

interface CybersportBlock {
  data?: {
    text?: string;
  };
}

@Injectable()
export class CybersportProvider {
  private readonly logger = new Logger(CybersportProvider.name);

  async fetchNews(): Promise<Partial<News>[]> {
    try {
      const response = await axios.get(CYBERSPORT_NEWS_URL, { timeout: 15000 });
      const items: CybersportItem[] | undefined = response.data?.data;

      if (!items || !Array.isArray(items)) {
        this.logger.warn('Cybersport API returned no items');
        return [];
      }

      const results = await Promise.allSettled(items.map((item) => this.fetchArticleText(item.id)));

      return items
        .map((item, idx) => {
          const text = results[idx]?.status === 'fulfilled' ? results[idx].value : '';
          const image = isValidImagePath(item.attributes.image)
            ? CYBERSPORT_IMAGE_URL + item.attributes.image
            : PLACEHOLDER_IMAGE;

          return {
            title: item.attributes.title?.trim(),
            publishedAt: item.attributes.publishedAt,
            slug: item.attributes.slug || '',
            image,
            text,
            category: 'cybersport',
            source: 'cybersport',
            readingTime: calcReadingTime(text),
          };
        })
        .filter((item) => item.title);
    } catch (error) {
      this.logger.error(`Cybersport fetch failed: ${error}`);
      return [];
    }
  }

  private async fetchArticleText(newsId: string): Promise<string> {
    try {
      const response = await axios.get(CYBERSPORT_ONE_NEWS_URL + newsId, { timeout: 10000 });
      const blocks: CybersportBlock[] | undefined =
        response.data?.data?.attributes?.content?.blocks;

      if (!Array.isArray(blocks)) return '';

      return blocks
        .filter((block) => block?.data?.text)
        .map((block) => cleanText(block.data!.text!))
        .filter((text) => text.length > 0)
        .join('\n\n');
    } catch (error) {
      this.logger.warn(`Failed to fetch article ${newsId}: ${error}`);
      return '';
    }
  }
}
