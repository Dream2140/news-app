import { Module } from '@nestjs/common';
import { ExternalNewsService } from './external-news.service';
import { ExternalNewsController } from './external-news.controller';
import { CybersportProvider } from './providers/cybersport.provider';
import { CurrentsProvider } from './providers/currents.provider';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [NewsModule],
  controllers: [ExternalNewsController],
  providers: [ExternalNewsService, CybersportProvider, CurrentsProvider],
})
export class ExternalNewsModule {}
