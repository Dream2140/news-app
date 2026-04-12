import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }

  @Get('news-comments/:id')
  async findByNewsId(@Param('id') id: string) {
    return this.commentsService.findByNewsId(id);
  }

  @Get('user-comments/:id')
  async findByUserId(@Param('id') id: string) {
    return this.commentsService.findByUserId(id);
  }
}
