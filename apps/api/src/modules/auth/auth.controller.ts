import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { JwtRefreshGuard } from './strategies/jwt-auth.guard';

const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

@Controller('user')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const result = await this.authService.logout(refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return result;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const result = await this.authService.refresh(refreshToken);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @Get('activate/:link')
  async activate(@Param('link') link: string, @Res() res: Response) {
    await this.authService.activate(link);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/activated`);
  }

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const sameSite = isProduction ? 'none' : 'lax';

    res.cookie('accessToken', accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      secure: isProduction,
      sameSite,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
      secure: isProduction,
      sameSite,
    });
  }
}
