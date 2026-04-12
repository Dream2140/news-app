import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './schemas/news.schema';

const mockNewsModel = {
  create: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
  find: vi.fn().mockReturnValue({
    sort: vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue([]) }),
      exec: vi.fn().mockResolvedValue([]),
    }),
    select: vi.fn().mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue([]) }),
    }),
  }),
  findOne: vi.fn(),
  deleteMany: vi.fn(),
  paginate: vi.fn(),
  distinct: vi.fn(),
  countDocuments: vi.fn(),
};

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsService, { provide: getModelToken(News.name), useValue: mockNewsModel }],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  describe('create', () => {
    it('should create news with image path', async () => {
      const dto = { title: 'Test', text: 'Content', category: 'cybersport' };
      mockNewsModel.create.mockResolvedValue({ ...dto, _id: '123' });

      await service.create(dto, '/uploads/test.jpg');

      expect(mockNewsModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test',
          image: '/uploads/test.jpg',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should call paginate with correct params', async () => {
      mockNewsModel.paginate.mockResolvedValue({ docs: [], totalDocs: 0 });

      await service.findAll(1, 10, 'all');

      expect(mockNewsModel.paginate).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 10, sort: { publishedAt: -1 } },
      );
    });

    it('should filter by category when not "all"', async () => {
      mockNewsModel.paginate.mockResolvedValue({ docs: [], totalDocs: 0 });

      await service.findAll(1, 10, 'cybersport');

      expect(mockNewsModel.paginate).toHaveBeenCalledWith(
        { category: 'cybersport' },
        { page: 1, limit: 10, sort: { publishedAt: -1 } },
      );
    });
  });

  describe('findById', () => {
    it('should return news', async () => {
      mockNewsModel.findById.mockResolvedValue({ _id: '123', title: 'Test' });

      const result = await service.findById('123');
      expect(result.title).toBe('Test');
    });

    it('should throw NotFoundException', async () => {
      mockNewsModel.findById.mockResolvedValue(null);

      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTitle', () => {
    it('should escape regex special characters', async () => {
      const execMock = vi.fn().mockResolvedValue([]);
      const limitMock = vi.fn().mockReturnValue({ exec: execMock });
      const sortMock = vi.fn().mockReturnValue({ limit: limitMock });
      mockNewsModel.find.mockReturnValue({ sort: sortMock });

      await service.findByTitle('test.+search');

      const queryArg = mockNewsModel.find.mock.calls[0]![0];
      expect(queryArg.title).toBeInstanceOf(RegExp);
      expect(queryArg.title.source).toContain('test\\.\\+search');
    });
  });

  describe('delete', () => {
    it('should delete and return message', async () => {
      mockNewsModel.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      const result = await service.delete('123');
      expect(result.message).toContain('123');
    });

    it('should throw if not found', async () => {
      mockNewsModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.delete('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('bulkCreate', () => {
    it('should skip existing news by title+source', async () => {
      mockNewsModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([{ title: 'Existing', source: 'cybersport' }]),
          }),
        }),
      });
      mockNewsModel.create.mockResolvedValue([{ title: 'New' }]);

      const result = await service.bulkCreate([
        { title: 'Existing', text: 'old', source: 'cybersport' },
        { title: 'New', text: 'new', source: 'cybersport' },
      ]);

      expect(mockNewsModel.create).toHaveBeenCalledWith([
        expect.objectContaining({ title: 'New' }),
      ]);
      expect(result).toBeDefined();
    });

    it('should return empty array if all exist', async () => {
      mockNewsModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([{ title: 'Existing', source: '' }]),
          }),
        }),
      });

      const result = await service.bulkCreate([{ title: 'Existing' }]);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty input', async () => {
      const result = await service.bulkCreate([]);
      expect(result).toEqual([]);
    });
  });
});
