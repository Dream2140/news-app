import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NewsModule } from './modules/news/news.module';
import { CommentsModule } from './modules/comments/comments.module';
import { MailModule } from './modules/mail/mail.module';
import { ExternalNewsModule } from './modules/external-news/external-news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : join(__dirname, '..', '..', '..', '.env'),
      validationSchema: Joi.object({
        PORT: Joi.number().default(5001),
        DB_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        SMTP_HOST: Joi.string().default('smtp.ethereal.email'),
        SMTP_PORT: Joi.number().default(587),
        SMTP_USER: Joi.string().default('dev@ethereal.email'),
        SMTP_PASSWORD: Joi.string().default('dev'),
        API_URL: Joi.string().default('http://localhost:5001'),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
        CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
        CURRENTS_API_KEY: Joi.string().optional().allow(''),
        CLOUDINARY_CLOUD_NAME: Joi.string().optional().allow(''),
        CLOUDINARY_API_KEY: Joi.string().optional().allow(''),
        CLOUDINARY_API_SECRET: Joi.string().optional().allow(''),
        REVALIDATE_SECRET: Joi.string().optional().allow(''),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        dotfiles: 'deny',
      },
    }),
    AuthModule,
    UsersModule,
    NewsModule,
    CommentsModule,
    MailModule,
    ExternalNewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
