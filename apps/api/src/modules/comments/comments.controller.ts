import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IUserDto, UserRole } from '@newsapp/shared';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCommentDto, @CurrentUser() user: IUserDto) {
    return this.commentsService.create({
      content: dto.content,
      newsId: dto.newsId,
      userId: user.id,
      nickname: user.nickname,
    });
  }

  @Get('news-comments/:id')
  async findByNewsId(@Param('id') id: string) {
    return this.commentsService.findByNewsId(id);
  }

  @Get('user-comments/:id')
  async findByUserId(@Param('id') id: string) {
    return this.commentsService.findByUserId(id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: IUserDto,
  ) {
    const comment = await this.commentsService.findById(id);
    if (comment.user.toString() !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Can only update own comments');
    }
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: IUserDto) {
    const comment = await this.commentsService.findById(id);
    if (comment.user.toString() !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Can only delete own comments');
    }
    return this.commentsService.delete(id);
  }
}
