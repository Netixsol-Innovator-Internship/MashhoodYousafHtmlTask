import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { WsGateway } from '../ws/ws.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
    private ws: WsGateway,
  ) {}

  async create(data: Partial<Notification>) {
    const doc = await this.notifModel.create(data);
    // emit to recipient in real-time
    this.ws.emitToUserId(
      (doc.recipient as Types.ObjectId).toString(),
      'notification',
      doc,
    );
    return doc;
  }

  async listForUser(userId: string) {
    return this.notifModel
      .find({ recipient: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate('sourceUser', 'username avatarUrl')
      .populate('comment', 'content');
  }

  async markAllRead(userId: string) {
    await this.notifModel.updateMany(
      { recipient: userId },
      { $set: { read: true } },
    );
    return { message: 'Marked all as read' };
  }
}
