import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifs: NotificationsService) {}

  @Get()
  list(@GetUser() user: any) {
    return this.notifs.listForUser(user.userId);
  }

  @Post('read-all')
  readAll(@GetUser() user: any) {
    return this.notifs.markAllRead(user.userId);
  }
}
