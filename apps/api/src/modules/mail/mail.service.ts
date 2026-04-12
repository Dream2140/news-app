import { Injectable, BadRequestException } from '@nestjs/common';
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

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendActivationMail(to: string, link: string): Promise<void> {
    if (/[\r\n]/.test(to) || /[\r\n]/.test(link)) {
      throw new BadRequestException('Invalid email parameters');
    }

    const safeLink = escapeHtml(link);

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject: `Account activation for ${this.configService.get<string>('API_URL')}`,
      html: `
        <div>
          <h1>To activate your account, follow the link</h1>
          <a href="${safeLink}">${safeLink}</a>
        </div>
      `,
    });
  }
}
