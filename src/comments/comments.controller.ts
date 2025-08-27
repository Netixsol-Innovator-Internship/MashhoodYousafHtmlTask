/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyDto } from './dto/reply.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { WsGateway } from '../ws/ws.gateway';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private readonly comments: CommentsService,
    private readonly ws: WsGateway,
  ) {}

  // @Post()
  // async create(@GetUser() user: any, @Body() dto: CreateCommentDto) {
  //   const comment = await this.comments.create(
  //     user.userId,
  //     dto.postId,
  //     dto.content,
  //   );
  //   // WS: notify all viewers of this post
  //   this.ws.emitToPost(dto.postId, 'newComment', {
  //     commentId: comment._id.toString(),
  //   });
  //   return comment;
  // }

  @Post()
  async create(@GetUser() user: any, @Body() dto: CreateCommentDto) {
    const comment = await this.comments.create(
      user.userId,
      dto.postId,
      dto.content,
    );

    // ✅ Send full populated comment to FE
    this.ws.emitToPost(dto.postId, 'newComment', comment);

    return comment;
  }

  // New route to get all comments
  @Get('all')
  async getAllComments() {
    return this.comments.findAll();
  }

  @Get('post/:postId')
  byPost(@Param('postId') postId: string) {
    return this.comments.listByPost(postId);
  }

  @Get(':id/replies')
  replies(@Param('id') id: string) {
    return this.comments.listReplies(id);
  }

  @Post(':id/reply')
  async reply(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() dto: ReplyDto,
  ) {
    const reply = await this.comments.reply(user.userId, id, dto.content);
    // WS: notify only parent author via their personal room
    this.ws.emitToUserId((reply as any).author.toString(), 'replyCreated', {
      commentId: reply._id.toString(),
      parentId: id,
    });
    return reply;
  }

  @Post(':id/like')
  async like(@GetUser() user: any, @Param('id') id: string) {
    const res = await this.comments.like(user.userId, id);
    // WS: update like count to post viewers
    this.ws.emitGlobal('commentLikeUpdated', {
      commentId: id,
      likesCount: res.likesCount,
    });
    return res;
  }

  @Post(':id/unlike')
  async unlike(@GetUser() user: any, @Param('id') id: string) {
    const res = await this.comments.unlike(user.userId, id);
    // WS: update like count to post viewers
    this.ws.emitGlobal('commentLikeUpdated', {
      commentId: id,
      likesCount: res.likesCount,
    });
    return res;
  }
}
