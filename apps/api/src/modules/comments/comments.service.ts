import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async create(dto: CreateCommentDto): Promise<CommentDocument> {
    return this.commentModel.create({
      content: dto.content,
      news: dto.newsId,
      user: dto.userId,
      nickname: dto.nickname,
      publishedAt: Date.now(),
    });
  }

  async findById(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<CommentDocument> {
    const comment = await this.commentModel.findByIdAndUpdate(id, dto, { new: true });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.commentModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return { message: `Comment ${id} deleted successfully` };
  }

  async findByNewsId(newsId: string): Promise<CommentDocument[]> {
    return this.commentModel.find({ news: newsId }).sort({ publishedAt: -1 }).exec();
  }

  async findByUserId(userId: string): Promise<CommentDocument[]> {
    return this.commentModel.find({ user: userId }).sort({ publishedAt: -1 }).exec();
  }
}
