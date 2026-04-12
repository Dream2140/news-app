import { Module } from '@nestjs/common';
import { ExternalNewsService } from './external-news.service';
import { ExternalNewsController } from './external-news.controller';
import { CybersportProvider } from './providers/cybersport.provider';
import { GuardianProvider } from './providers/guardian.provider';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [NewsModule],
  controllers: [ExternalNewsController],
  providers: [ExternalNewsService, CybersportProvider, GuardianProvider],
})
export class ExternalNewsModule {}
