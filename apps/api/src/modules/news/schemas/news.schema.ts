import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoosePaginate = require('mongoose-paginate-v2');

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, default: '' })
  text: string;

  @Prop({ default: () => Date.now() })
  publishedAt: number;

  @Prop({ default: '' })
  slug: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ default: '' })
  source: string;

  @Prop({ default: 1 })
  readingTime: number;
}

export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.plugin(mongoosePaginate);
NewsSchema.index({ category: 1, publishedAt: -1 });
NewsSchema.index({ title: 'text' });
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ title: 1, source: 1 }, { unique: true });
