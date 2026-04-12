import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoosePaginate = require('mongoose-paginate-v2');

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String })
  text: string;

  @Prop()
  publishedAt: number;

  @Prop()
  slug: string;

  @Prop()
  image: string;

  @Prop({ type: [String], default: [] })
  category: string[];
}

export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.plugin(mongoosePaginate);
