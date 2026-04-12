import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { News } from '../../news/schemas/news.schema';
import { CloudinaryService } from '../../upload/cloudinary.service';

const CYBERSPORT_API = 'https://www.cybersport.ru/api/materials';
const CYBERSPORT_IMAGE_CDN = 'https://virtus-img.cdnvideo.ru/images/material-card/plain/';
const PLACEHOLDER_IMAGE = 'https://placehold.co/800x400/1a1a2e/e94560?text=Cybersport';

function cleanHtml(str: string): string {
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&laquo;/g, '\u00AB')
    .replace(/&raquo;/g, '\u00BB')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
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
  type: string;
  data?: {
    text?: string;
    source?: string;
    items?: string[];
  };
}

@Injectable()
export class CybersportProvider {
  private readonly logger = new Logger(CybersportProvider.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async fetchNews(): Promise<Partial<News>[]> {
    try {
      const response = await axios.get(CYBERSPORT_API, {
        timeout: 15000,
        params: { pageoffset: 0, pagelimit: 20, sort: '-publishedAt' },
      });

      const items: CybersportItem[] | undefined = response.data?.data;
      if (!items?.length) {
        this.logger.warn('Cybersport API returned no items');
        return [];
      }

      const results = await Promise.allSettled(items.map((item) => this.processArticle(item)));

      return results
        .filter((r): r is PromiseFulfilledResult<Partial<News>> => r.status === 'fulfilled')
        .map((r) => r.value)
        .filter((item) => item.title && item.text);
    } catch (error) {
      this.logger.error(`Cybersport fetch failed: ${error}`);
      return [];
    }
  }

  private async processArticle(item: CybersportItem): Promise<Partial<News>> {
    const [text, image] = await Promise.all([
      this.fetchArticleText(item.id),
      this.uploadImage(item.attributes.image),
    ]);

    return {
      title: item.attributes.title?.trim(),
      publishedAt: item.attributes.publishedAt * 1000,
      slug: item.attributes.slug || '',
      image,
      text,
      category: 'cybersport',
      source: 'cybersport',
      readingTime: calcReadingTime(text),
    };
  }

  private async uploadImage(imagePath: string): Promise<string> {
    if (!imagePath || imagePath.length < 5) return PLACEHOLDER_IMAGE;
    const sourceUrl = CYBERSPORT_IMAGE_CDN + imagePath;
    const url = await this.cloudinaryService.uploadFromUrl(sourceUrl, 'newsapp/cybersport');
    return url || PLACEHOLDER_IMAGE;
  }

  private async fetchArticleText(newsId: string): Promise<string> {
    try {
      const response = await axios.get(`${CYBERSPORT_API}/${newsId}`, { timeout: 10000 });
      const blocks: CybersportBlock[] | undefined =
        response.data?.data?.attributes?.content?.blocks;

      if (!Array.isArray(blocks)) return '';

      const paragraphs: string[] = [];

      for (const block of blocks) {
        if (!block.data) continue;

        switch (block.type) {
          case 'paragraph':
          case 'header':
            if (block.data.text) paragraphs.push(cleanHtml(block.data.text));
            break;

          case 'incut':
          case 'quote':
            if (block.data.text) {
              const quote = cleanHtml(block.data.text);
              const src = block.data.source ? ` \u2014 ${cleanHtml(block.data.source)}` : '';
              paragraphs.push(`\u00AB${quote}\u00BB${src}`);
            }
            break;

          case 'list':
            if (block.data.items) {
              for (const li of block.data.items) {
                paragraphs.push(`\u2022 ${cleanHtml(li)}`);
              }
            }
            break;
        }
      }

      return paragraphs.filter((p) => p.length > 0).join('\n\n');
    } catch (error) {
      this.logger.warn(`Failed to fetch article ${newsId}: ${error}`);
      return '';
    }
  }
}
