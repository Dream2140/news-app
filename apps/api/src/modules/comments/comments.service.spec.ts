import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comment.schema';

const mockCommentModel = {
  create: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
  find: vi.fn(),
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getModelToken(Comment.name), useValue: mockCommentModel },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const dto = { content: 'Test', newsId: 'n1', userId: 'u1', nickname: 'user' };
      mockCommentModel.create.mockResolvedValue({ _id: 'c1', ...dto });

      const result = await service.create(dto);
      expect(result._id).toBe('c1');
      expect(mockCommentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'Test', publishedAt: expect.any(Number) }),
      );
    });
  });

  describe('findById', () => {
    it('should return comment', async () => {
      mockCommentModel.findById.mockResolvedValue({ _id: 'c1', content: 'Test' });
      const result = await service.findById('c1');
      expect(result.content).toBe('Test');
    });

    it('should throw if not found', async () => {
      mockCommentModel.findById.mockResolvedValue(null);
      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete and return message', async () => {
      mockCommentModel.findByIdAndDelete.mockResolvedValue({ _id: 'c1' });
      const result = await service.delete('c1');
      expect(result.message).toContain('c1');
    });

    it('should throw if not found', async () => {
      mockCommentModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.delete('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByNewsId', () => {
    it('should return comments sorted by date', async () => {
      const execMock = vi.fn().mockResolvedValue([{ _id: 'c1' }]);
      const sortMock = vi.fn().mockReturnValue({ exec: execMock });
      mockCommentModel.find.mockReturnValue({ sort: sortMock });

      const result = await service.findByNewsId('n1');
      expect(mockCommentModel.find).toHaveBeenCalledWith({ news: 'n1' });
      expect(sortMock).toHaveBeenCalledWith({ publishedAt: -1 });
      expect(result).toHaveLength(1);
    });
  });
});
