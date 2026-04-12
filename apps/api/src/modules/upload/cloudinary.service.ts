import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private configured = false;

  constructor(private readonly configService: ConfigService) {}

  private ensureConfig() {
    if (this.configured) return;
    const cloud_name = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const api_key = this.configService.get<string>('CLOUDINARY_API_KEY');
    const api_secret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloud_name || !api_key || !api_secret) {
      this.logger.warn('Cloudinary not configured — missing env vars');
      return;
    }

    cloudinary.config({ cloud_name, api_key, api_secret });
    this.configured = true;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    this.ensureConfig();
    if (!this.configured) return '';

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'newsapp',
              resource_type: 'image',
              transformation: [{ width: 1200, height: 630, crop: 'limit', quality: 'auto' }],
            },
            (error, result) => {
              if (error || !result) reject(error);
              else resolve(result);
            },
          )
          .end(file.buffer);
      });
      return result.secure_url;
    } catch (error) {
      this.logger.error(`Cloudinary upload failed: ${error}`);
      return '';
    }
  }

  async uploadFromUrl(imageUrl: string, folder = 'newsapp'): Promise<string> {
    this.ensureConfig();
    if (!this.configured) return '';

    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 630, crop: 'limit', quality: 'auto', format: 'webp' },
        ],
      });
      return result.secure_url;
    } catch (error) {
      this.logger.warn(`Cloudinary URL upload failed for ${imageUrl}: ${error}`);
      return '';
    }
  }
}
