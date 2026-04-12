import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CloudinaryService } from '../upload/cloudinary.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@newsapp/shared';

const IMAGE_WHITELIST = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('get-all-news')
  async getAllNews(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category = 'all',
  ) {
    return this.newsService.findAll(+page, +limit, category.toLowerCase());
  }

  @Get('get-news-by-id/:id')
  async getNewsById(@Param('id') id: string) {
    return this.newsService.findById(id);
  }

  @Get('get-news-by-title')
  async getNewsByTitle(@Query('title') title: string) {
    return this.newsService.findByTitle(title.toLowerCase());
  }

  @Get('category')
  async getNewsByCategory(@Query('category') category: string, @Query('page') page = 1) {
    return this.newsService.findByCategory(category, +page);
  }

  @Get('related/:id')
  async getRelated(@Param('id') id: string) {
    return this.newsService.findRelated(id);
  }

  @Post('post-news')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!IMAGE_WHITELIST.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: 5_000_000 },
    }),
  )
  async createNews(@Body() dto: CreateNewsDto, @UploadedFile() file: Express.Multer.File) {
    let imagePath: string | undefined;
    if (file) {
      imagePath = await this.cloudinaryService.uploadImage(file);
    }
    return this.newsService.create(dto, imagePath);
  }

  @Put('update-news/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateNews(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete('delete-news/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteNews(@Param('id') id: string) {
    return this.newsService.delete(id);
  }

  @Delete('delete-all-news')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteAllNews() {
    return this.newsService.deleteAll();
  }
}
