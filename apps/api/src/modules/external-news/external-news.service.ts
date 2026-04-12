import { Injectable } from '@nestjs/common';
import { CybersportProvider } from './providers/cybersport.provider';
import { GuardianProvider } from './providers/guardian.provider';
import { NewsService } from '../news/news.service';

@Injectable()
export class ExternalNewsService {
  constructor(
    private readonly cybersportProvider: CybersportProvider,
    private readonly guardianProvider: GuardianProvider,
    private readonly newsService: NewsService,
  ) {}

  async fetchFromCybersport() {
    const newsList = await this.cybersportProvider.fetchNews();
    return this.newsService.bulkCreate(newsList);
  }

  async fetchFromGuardian() {
    const newsList = await this.guardianProvider.fetchNews();
    return this.newsService.bulkCreate(newsList);
  }
}
