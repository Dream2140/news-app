import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

const mockUserModel = {
  findOne: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  countDocuments: vi.fn(),
  deleteMany: vi.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getModelToken(User.name), useValue: mockUserModel }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should throw if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(
        service.create(
          { nickname: 'test', email: 'test@test.com', password: '123456' },
          'activation-link',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create user with hashed password', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        _id: '123',
        nickname: 'test',
        email: 'test@test.com',
        password: 'hashed',
        role: 'USER',
        isActivated: false,
      });

      const user = await service.create(
        { nickname: 'test', email: 'test@test.com', password: '123456' },
        'activation-link',
      );

      expect(user).toBeDefined();
      expect(mockUserModel.create).toHaveBeenCalled();
      const createArg = mockUserModel.create.mock.calls[0]![0];
      expect(createArg.password).not.toBe('123456');
      expect(createArg.activationLink).toBe('activation-link');
    });
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      const selectMock = vi.fn().mockResolvedValue({ _id: '123', nickname: 'test' });
      mockUserModel.findById.mockReturnValue({ select: selectMock });

      const user = await service.findById('123');
      expect(user).toEqual({ _id: '123', nickname: 'test' });
      expect(selectMock).toHaveBeenCalledWith('-password');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockUserModel.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw if no fields provided', async () => {
      await expect(service.update('123', {})).rejects.toThrow(BadRequestException);
    });

    it('should update and return user', async () => {
      const updated = { _id: '123', nickname: 'updated' };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: vi.fn().mockResolvedValue(updated),
      });

      const result = await service.update('123', { nickname: 'updated' });
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete user and return message', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      const result = await service.delete('123');
      expect(result.message).toContain('123');
    });

    it('should throw if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.delete('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    it('should throw if wrong current password', async () => {
      mockUserModel.findById.mockResolvedValue({
        _id: '123',
        password: '$2b$12$invalidsalt',
      });

      await expect(
        service.changePassword('123', { currentPassword: 'wrong', newPassword: 'new123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
