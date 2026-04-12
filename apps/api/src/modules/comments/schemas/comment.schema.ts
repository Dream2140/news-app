import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  nickname: string;

  @Prop({ type: Types.ObjectId, ref: 'News', required: true })
  news: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: () => Date.now() })
  publishedAt: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
