import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, enum: ['comment', 'reply', 'like'] })
  type: 'comment' | 'reply' | 'like';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sourceUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  comment?: Types.ObjectId | null;

  @Prop({ default: '' })
  postId?: string;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
