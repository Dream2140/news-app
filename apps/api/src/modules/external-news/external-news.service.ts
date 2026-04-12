import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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

    this.logger.log(
      `Scheduled fetch complete: ${cybersportCount} from Cybersport, ${currentsCount} from Currents`,
    );
  }

  async fetchFromCybersport() {
    const newsList = await this.cybersportProvider.fetchNews();
    return this.newsService.bulkCreate(newsList);
  }

  async fetchFromCurrents() {
    const newsList = await this.currentsProvider.fetchNews();
    return this.newsService.bulkCreate(newsList);
  }
}
