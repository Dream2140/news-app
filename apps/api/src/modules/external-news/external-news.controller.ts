import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExternalNewsService } from './external-news.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@newsapp/shared';

@Controller('news')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ExternalNewsController {
  constructor(private readonly externalNewsService: ExternalNewsService) {}

  @Get('update-from-cybersport')
  async fetchFromCybersport() {
    return this.externalNewsService.fetchFromCybersport();
  }

  @Get('update-from-guardian')
  async fetchFromGuardian() {
    return this.externalNewsService.fetchFromGuardian();
  }
}
