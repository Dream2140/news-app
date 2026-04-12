import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Token } from './schemas/token.schema';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

const mockTokenModel = {
  findOne: vi.fn(),
  create: vi.fn(),
  deleteOne: vi.fn(),
};

const mockUsersService = {
  create: vi.fn(),
  validatePassword: vi.fn(),
  findById: vi.fn(),
  activate: vi.fn(),
};

const mockMailService = {
  sendActivationMail: vi.fn(),
};

const mockJwtService = {
  sign: vi.fn().mockReturnValue('mock-token'),
  verify: vi.fn(),
};

const mockConfigService = {
  get: vi.fn((key: string) => {
    const config: Record<string, string> = {
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      API_URL: 'http://localhost:5001',
      FRONTEND_URL: 'http://localhost:3000',
    };
    return config[key];
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(Token.name), useValue: mockTokenModel },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create user, send email, and return tokens', async () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@test.com',
        nickname: 'test',
        role: 'USER',
        isActivated: false,
      };
      mockUsersService.create.mockResolvedValue(mockUser);
      mockMailService.sendActivationMail.mockResolvedValue(undefined);
      mockTokenModel.findOne.mockResolvedValue(null);
      mockTokenModel.create.mockResolvedValue({});

      const result = await service.register({
        nickname: 'test',
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(result.user.email).toBe('test@test.com');
      expect(mockMailService.sendActivationMail).toHaveBeenCalledWith(
        'test@test.com',
        expect.stringContaining('/api/user/activate/'),
      );
    });
  });

  describe('login', () => {
    it('should authenticate and return tokens', async () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@test.com',
        nickname: 'test',
        role: 'USER',
        isActivated: true,
      };
      mockUsersService.validatePassword.mockResolvedValue(mockUser);
      mockTokenModel.findOne.mockResolvedValue(null);
      mockTokenModel.create.mockResolvedValue({});

      const result = await service.login({ email: 'test@test.com', password: '123456' });

      expect(result.user.email).toBe('test@test.com');
      expect(result.accessToken).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('should throw if no refresh token', async () => {
      await expect(service.refresh('')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if token not in DB', async () => {
      mockJwtService.verify.mockReturnValue({ id: '123' });
      mockTokenModel.findOne.mockResolvedValue(null);

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delete token', async () => {
      mockTokenModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.logout('some-refresh-token');
      expect(result.message).toBe('Logged out successfully');
    });
  });
});
