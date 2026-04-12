import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { CybersportProvider } from './providers/cybersport.provider';
import { CurrentsProvider } from './providers/currents.provider';
import { NewsService } from '../news/news.service';

@Injectable()
export class ExternalNewsService implements OnModuleInit {
  private readonly logger = new Logger(ExternalNewsService.name);

  constructor(
    private readonly cybersportProvider: CybersportProvider,
    private readonly currentsProvider: CurrentsProvider,
    private readonly newsService: NewsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('Running initial news fetch on startup...');
    await this.handleScheduledFetch();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleScheduledFetch() {
    this.logger.log('Running scheduled news fetch...');

    const [cybersportResult, currentsResult] = await Promise.allSettled([
      this.fetchFromCybersport(),
      this.fetchFromCurrents(),
    ]);

    const cybersportCount =
      cybersportResult.status === 'fulfilled' ? cybersportResult.value.length : 0;
    const currentsCount = currentsResult.status === 'fulfilled' ? currentsResult.value.length : 0;

    if (cybersportResult.status === 'rejected') {
      this.logger.error(`Cybersport fetch failed: ${cybersportResult.reason}`);
    }
    if (currentsResult.status === 'rejected') {
      this.logger.error(`Currents fetch failed: ${currentsResult.reason}`);
    }

    const totalNew = cybersportCount + currentsCount;
    this.logger.log(
      `Scheduled fetch complete: ${cybersportCount} from Cybersport, ${currentsCount} from Currents`,
    );

    if (totalNew > 0) {
      await this.triggerRevalidation();
    }
  }

  async fetchFromCybersport() {
    const newsList = await this.cybersportProvider.fetchNews();
    return this.newsService.bulkCreate(newsList);
  }

  async fetchFromCurrents() {
    const newsList = await this.currentsProvider.fetchNews();
    return this.newsService.bulkCreate(newsList);
  }

  private async triggerRevalidation() {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const secret = this.configService.get<string>('REVALIDATE_SECRET');

    if (!frontendUrl || !secret) {
      this.logger.warn('FRONTEND_URL or REVALIDATE_SECRET not set, skipping revalidation');
      return;
    }

    try {
      await axios.post(`${frontendUrl}/api/revalidate`, null, {
        headers: { 'x-revalidate-secret': secret },
        timeout: 10000,
      });
      this.logger.log('Frontend revalidation triggered');
    } catch (error) {
      this.logger.warn(`Failed to trigger revalidation: ${error}`);
    }
  }
}
