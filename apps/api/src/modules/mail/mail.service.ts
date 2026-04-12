import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.get<string>('SMTP_USER') ?? '';
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.from,
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendActivationMail(to: string, link: string): Promise<void> {
    this.validateParams(to, link);
    const safeLink = escapeHtml(link);

    try {
      await this.transporter.sendMail({
        from: `"Dream News" <${this.from}>`,
        to,
        subject: 'Activate your Dream News account',
        html: this.template(
          'Welcome to Dream News!',
          'Click the button below to activate your account:',
          safeLink,
          'Activate Account',
        ),
      });
    } catch (error) {
      this.logger.error(`Failed to send activation email to ${to}: ${error}`);
    }
  }

  async sendResetPasswordMail(to: string, link: string): Promise<void> {
    this.validateParams(to, link);
    const safeLink = escapeHtml(link);

    try {
      await this.transporter.sendMail({
        from: `"Dream News" <${this.from}>`,
        to,
        subject: 'Reset your password — Dream News',
        html: this.template(
          'Password Reset',
          'You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.',
          safeLink,
          'Reset Password',
          'If you didn\u2019t request this, you can safely ignore this email.',
        ),
      });
    } catch (error) {
      this.logger.error(`Failed to send reset email to ${to}: ${error}`);
    }
  }

  private validateParams(to: string, link: string) {
    if (/[\r\n]/.test(to) || /[\r\n]/.test(link)) {
      throw new BadRequestException('Invalid email parameters');
    }
  }

  private template(title: string, text: string, link: string, buttonText: string, footer?: string) {
    return `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#0a0a1a;color:#e8e8f0;border-radius:12px;">
        <h1 style="color:#e94560;font-size:24px;margin-bottom:16px;">${title}</h1>
        <p style="color:#9898b0;line-height:1.6;">${text}</p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#e94560;color:white;text-decoration:none;border-radius:8px;font-weight:600;">${buttonText}</a>
        ${footer ? `<p style="color:#555;font-size:12px;">${footer}</p>` : ''}
      </div>
    `;
  }
}
