import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { Token, TokenDocument } from './schemas/token.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { IUserDto } from '@newsapp/shared';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const activationLink = crypto.randomUUID();
    const user = await this.usersService.create(dto, activationLink);

    const apiUrl = this.configService.get<string>('API_URL');
    await this.mailService.sendActivationMail(
      dto.email,
      `${apiUrl}/api/user/activate/${activationLink}`,
    );

    const userDto = this.toUserDto(user);
    const tokens = this.generateTokens(userDto);
    await this.saveToken(user._id.toString(), tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.validatePassword(dto.email, dto.password);
    const userDto = this.toUserDto(user);
    const tokens = this.generateTokens(userDto);
    await this.saveToken(user._id.toString(), tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken: string) {
    await this.tokenModel.deleteOne({ refreshToken });
    return { message: 'Logged out successfully' };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenModel.findOne({ refreshToken });

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(userData.id);
    const userDto = this.toUserDto(user);
    const tokens = this.generateTokens(userDto);
    await this.saveToken(user._id.toString(), tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink: string) {
    await this.usersService.activate(activationLink);
  }

  private generateTokens(payload: IUserDto) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  private validateRefreshToken(token: string): IUserDto | null {
    try {
      return this.jwtService.verify<IUserDto>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return null;
    }
  }

  private async saveToken(userId: string, refreshToken: string) {
    const existingToken = await this.tokenModel.findOne({ user: userId });

    if (existingToken) {
      existingToken.refreshToken = refreshToken;
      return existingToken.save();
    }

    return this.tokenModel.create({ user: userId, refreshToken });
  }

  private toUserDto(user: UserDocument): IUserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      isActivated: user.isActivated,
    };
  }
}
