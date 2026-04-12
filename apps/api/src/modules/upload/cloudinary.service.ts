import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
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
