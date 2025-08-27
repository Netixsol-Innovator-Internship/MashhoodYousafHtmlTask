import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@GetUser() user: any) {
    return this.usersService.profile(user.userId);
  }

  @Patch('me')
  update(@GetUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  @Post(':id/follow')
  follow(@GetUser() user: any, @Param('id') id: string) {
    return this.usersService.follow(user.userId, id);
  }

  @Post(':id/unfollow')
  unfollow(@GetUser() user: any, @Param('id') id: string) {
    return this.usersService.unfollow(user.userId, id);
  }
}
