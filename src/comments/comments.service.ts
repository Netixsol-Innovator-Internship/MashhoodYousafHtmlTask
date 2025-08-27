/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private notifications: NotificationsService,
    private usersService: UsersService,
  ) {}

  // async create(userId: string, postId: string, content: string) {
  //   const comment = await this.commentModel.create({
  //     author: new Types.ObjectId(userId),
  //     postId,
  //     content,
  //     parentComment: null,
  //   });

  //   // Notify followers? Requirement says: notify all users on comment (broadcast). We'll broadcast via WS;
  //   // For persistence we can create notifications to followers OR globally skip. We'll persist to post followers not defined,
  //   // so create no DB notifications here; but we will emit WS event.
  //   return comment;
  // }

  // comments.service.ts (modify create)
  async create(userId: string, postId: string, content: string) {
    const created = await this.commentModel.create({
      author: new Types.ObjectId(userId),
      postId,
      content,
      parentComment: null,
    });

    // return the populated comment (so author.username is available)
    return this.commentModel
      .findById(created._id)
      .populate('author', 'username')
      .lean();
  }

  // Add this new method
  async findAll(): Promise<Comment[]> {
    return this.commentModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .lean();
  }

  async listByPost(postId: string) {
    return this.commentModel
      .find({ postId, parentComment: null })
      .sort({ createdAt: -1 })
      .populate('author', 'username email avatarUrl');
  }

  async listReplies(parentCommentId: string) {
    return this.commentModel
      .find({ parentComment: new Types.ObjectId(parentCommentId) })
      .sort({ createdAt: 1 })
      .populate('author', 'username email avatarUrl');
  }

  async reply(userId: string, parentCommentId: string, content: string) {
    const parent = await this.commentModel.findById(parentCommentId);
    if (!parent) throw new NotFoundException('Parent comment not found');

    const reply = await this.commentModel.create({
      author: new Types.ObjectId(userId),
      postId: parent.postId,
      content,
      parentComment: parent._id,
    });

    // Create notification for the parent comment author (do not notify everyone)
    if (parent.author.toString() !== userId) {
      await this.notifications.create({
        type: 'reply',
        recipient: parent.author as any,
        sourceUser: new Types.ObjectId(userId),
        comment: reply._id,
        postId: parent.postId,
      });
    }
    return reply;
  }

  // comments.service.ts - replace existing like() and unlike() methods

  async like(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const uId = new Types.ObjectId(userId);
    const has = comment.likes.some((id) => id.toString() === userId);

    let liked = false;
    let likedBy: string | null = null;

    if (!has) {
      comment.likes.push(uId);
      await comment.save();
      liked = true;

      // get username of the liker
      const user = await this.usersService.findById(userId); // ensure UsersService has findById
      likedBy = user?.username ?? null;

      // notify comment author (DB notification)
      if (comment.author.toString() !== userId) {
        await this.notifications.create({
          type: 'like',
          recipient: comment.author as any,
          sourceUser: uId,
          comment: comment._id,
          postId: comment.postId,
        });
      }
    }

    return { likesCount: comment.likes.length, liked, likedBy };
  }

  async unlike(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const uIdStr = userId.toString();
    comment.likes = comment.likes.filter((id) => id.toString() !== uIdStr);
    await comment.save();

    // get username for emitting context (optional)
    const user = await this.usersService.findById(userId);
    const likedBy = user?.username ?? null;

    return { likesCount: comment.likes.length, liked: false, likedBy };
  }
}
