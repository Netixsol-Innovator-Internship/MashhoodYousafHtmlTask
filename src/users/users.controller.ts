<<<<<<< HEAD
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

  @Get('me/followers')
  async getFollowers(@GetUser() user: any) {
    return this.usersService.getFollowers(user.userId);
  }

  @Get('me/following')
  async getFollowing(@GetUser() user: any) {
    return this.usersService.getFollowing(user.userId);
  }

  @Post(':id/follow')
  follow(@GetUser() user: any, @Param('id') id: string) {
    return this.usersService.follow(user.userId, id);
  }

  @Post(':id/unfollow')
  unfollow(@GetUser() user: any, @Param('id') id: string) {
    return this.usersService.unfollow(user.userId, id);
  }

  // Add these endpoints to your existing UsersController
  @Get()
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get('discover')
  async getDiscoverUsers(@GetUser() user: any) {
    return this.usersService.getDiscoverUsers(user.userId);
  }

  @Get(':id/isfollowing')
  async checkIfFollowing(@GetUser() user: any, @Param('id') targetId: string) {
    return this.usersService.checkIfFollowing(user.userId, targetId);
=======
// users/users.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      mobileNumber: string;
    },
  ) {
    if (!body) {
      throw new BadRequestException('Fields are missing');
    }

    const { name, email, password, mobileNumber } = body;

    // Check all fields
    const fields = [name, email, password, mobileNumber];
    if (fields.some((field) => !field?.trim())) {
      throw new BadRequestException('All fields are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Please use a valid email');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create user
    const user = await this.usersService.createUser({
      name,
      email,
      password,
      mobileNumber,
    });

    return { message: 'User registered successfully', userId: user._id };
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    if (!body) {
      throw new BadRequestException('Fields are missing');
    }

    const { email, password } = body;

    if (!email?.trim() || !password?.trim()) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = this.usersService.generateToken(user);
    console.log('token', token);

    return { message: 'Login successful', userId: user._id, token };
>>>>>>> 629360c (login signup with token and crud on cars, based on token)
  }
}
