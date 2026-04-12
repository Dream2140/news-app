import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

const DEFAULT_NEWS_LIMIT = 8;

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface PaginateOptions {
  page?: number;
  limit?: number;
  pagination?: boolean;
}

interface PaginateModel<T> extends Model<T> {
  paginate(query: object, options: PaginateOptions): Promise<unknown>;
}

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: PaginateModel<NewsDocument>) {}

  async create(dto: CreateNewsDto, imagePath?: string): Promise<NewsDocument> {
    return this.newsModel.create({
      ...dto,
      publishedAt: dto.publishedAt ? Number(dto.publishedAt) : Date.now(),
      image: imagePath ?? '',
    });
  }

  async findAll(page: number, limit: number, category: string) {
    const query = category !== 'all' ? { category } : {};

    if (limit === -1) {
      return this.newsModel.paginate(query, { pagination: false });
    }

    return this.newsModel.paginate(query, { page, limit });
  }

  async findById(id: string): Promise<NewsDocument> {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new NotFoundException(`News with id ${id} not found`);
    }
    return news;
  }

  async findByTitle(title: string): Promise<NewsDocument[]> {
    const escapedTitle = escapeRegExp(title);
    return this.newsModel
      .find({ title: new RegExp(escapedTitle, 'i') })
      .sort({ publishedAt: -1 })
      .exec();
  }

  async findByCategory(category: string, page: number) {
    return this.newsModel.paginate(
      { category: category.toLowerCase() },
      { page, limit: DEFAULT_NEWS_LIMIT },
    );
  }

  async update(id: string, dto: UpdateNewsDto): Promise<NewsDocument> {
    const news = await this.newsModel.findByIdAndUpdate(id, dto, { new: true });
    if (!news) {
      throw new NotFoundException(`News with id ${id} not found`);
    }
    return news;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.newsModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`News with id ${id} not found`);
    }
    return { message: `News ${id} deleted successfully` };
  }

  async deleteAll(): Promise<{ message: string }> {
    const result = await this.newsModel.deleteMany();
    return { message: `${result.deletedCount} news items deleted` };
  }

  async bulkCreate(newsList: Partial<News>[]): Promise<NewsDocument[]> {
    const uniqueNews: Partial<News>[] = [];

    for (const item of newsList) {
      const exists = await this.newsModel.findOne({ title: item.title });
      if (!exists) {
        uniqueNews.push(item);
      }
    }

    if (uniqueNews.length === 0) {
      return [];
    }

    return this.newsModel.create(uniqueNews);
  }
}
