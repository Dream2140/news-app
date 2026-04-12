import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { News } from '../../news/schemas/news.schema';

const CYBERSPORT_NEWS_URL =
  'https://www.cybersport.ru/api/materials?pageoffset=0&pagelimit=200&sort=-publishedAt';
const CYBERSPORT_ONE_NEWS_URL = 'https://www.cybersport.ru/api/materials/';
const CYBERSPORT_IMAGE_URL = 'https://virtus-img.cdnvideo.ru/images/material-card/plain/';

function clearHtmlTags(str: string): string {
  return str.replace(/<[^>]*>?/gm, '');
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
    const response = await axios.get(CYBERSPORT_NEWS_URL, { timeout: 10000 });
    const items: CybersportItem[] | undefined = response.data?.data;

    if (!items || !Array.isArray(items)) {
      return [];
    }

    const results = await Promise.allSettled(items.map((item) => this.fetchArticleText(item.id)));

    return items.map((item, idx) => ({
      title: item.attributes.title,
      publishedAt: item.attributes.publishedAt,
      slug: item.attributes.slug,
      image: CYBERSPORT_IMAGE_URL + item.attributes.image,
      text: results[idx]?.status === 'fulfilled' ? results[idx].value : '',
      category: ['cybersport'],
    }));
  }

  private async fetchArticleText(newsId: string): Promise<string> {
    try {
      const response = await axios.get(CYBERSPORT_ONE_NEWS_URL + newsId, { timeout: 10000 });
      const blocks: CybersportBlock[] | undefined =
        response.data?.data?.attributes?.content?.blocks;

      if (!Array.isArray(blocks)) return '';

      return blocks
        .filter((block) => block?.data?.text)
        .map((block) => clearHtmlTags(block.data!.text!))
        .join(' ');
    } catch (error) {
      this.logger.warn(`Failed to fetch article ${newsId}: ${error}`);
      return '';
    }
  }
}
