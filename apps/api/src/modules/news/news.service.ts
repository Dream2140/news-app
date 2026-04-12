import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

const DEFAULT_NEWS_LIMIT = 8;
const MAX_LIMIT = 1000;

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface PaginateOptions {
  page?: number;
  limit?: number;
  pagination?: boolean;
  sort?: Record<string, number>;
}

interface PaginateModel<T> extends Model<T> {
  paginate(query: object, options: PaginateOptions): Promise<unknown>;
}

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: PaginateModel<NewsDocument>) {}

  async create(dto: CreateNewsDto, imagePath?: string): Promise<NewsDocument> {
    const text = dto.text ?? '';
    return this.newsModel.create({
      ...dto,
      publishedAt: dto.publishedAt ? Number(dto.publishedAt) : Date.now(),
      image: imagePath ?? '',
      readingTime: calcReadingTime(text),
      source: 'manual',
    });
  }

  async findAll(page: number, limit: number, category: string) {
    const query = category !== 'all' ? { category } : {};
    const sort = { publishedAt: -1 };

    if (limit === -1) {
      return this.newsModel.paginate(query, { pagination: false, sort, limit: MAX_LIMIT });
    }

    return this.newsModel.paginate(query, { page, limit, sort });
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
      .limit(50)
      .exec();
  }

  async findByCategory(category: string, page: number) {
    return this.newsModel.paginate(
      { category: category.toLowerCase() },
      { page, limit: DEFAULT_NEWS_LIMIT, sort: { publishedAt: -1 } },
    );
  }

  async findRelated(id: string, limit = 4): Promise<NewsDocument[]> {
    const news = await this.newsModel.findById(id);
    if (!news) return [];

    return this.newsModel
      .find({ category: news.category, _id: { $ne: news._id } })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
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

  async count(): Promise<number> {
    return this.newsModel.countDocuments();
  }

  async bulkCreate(newsList: Partial<News>[]): Promise<NewsDocument[]> {
    if (newsList.length === 0) return [];

    const items = newsList.filter((n) => n.title?.trim());

    const existingDocs = await this.newsModel
      .find({
        $or: items.map((n) => ({
          title: { $regex: new RegExp(`^${escapeRegExp(n.title!.trim())}$`, 'i') },
          source: n.source ?? '',
        })),
      })
      .select('title source')
      .lean()
      .exec();

    const existingKeys = new Set(existingDocs.map((d) => `${d.title.toLowerCase()}::${d.source}`));

    const uniqueNews = items.filter(
      (item) => !existingKeys.has(`${item.title!.trim().toLowerCase()}::${item.source ?? ''}`),
    );

    if (uniqueNews.length === 0) return [];

    try {
      return await this.newsModel.create(uniqueNews);
    } catch (error) {
      // Handle duplicate key errors gracefully (race condition)
      if ((error as { code?: number }).code === 11000) {
        return [];
      }
      throw error;
    }
  }
}
