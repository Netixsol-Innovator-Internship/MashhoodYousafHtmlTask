/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async profile(userId: string) {
    const u = await this.findById(userId);
    return {
      id: u._id,
      email: u.email,
      username: u.username,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      followersCount: u.followers.length,
      followingCount: u.following.length,
      createdAt: (u as any).createdAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true });
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId)
      throw new BadRequestException('Cannot follow yourself');
    const user = await this.findById(userId);
    const target = await this.findById(targetId);

    if (!user.following.includes(new Types.ObjectId(targetId))) {
      user.following.push(new Types.ObjectId(targetId));
      await user.save();
    }

    if (!target.followers.includes(new Types.ObjectId(userId))) {
      target.followers.push(new Types.ObjectId(userId));
      await target.save();
    }
    return { message: 'Followed' };
  }

  async unfollow(userId: string, targetId: string) {
    const user = await this.findById(userId);
    const target = await this.findById(targetId);

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter(
      (id) => id.toString() !== userId,
    );
    await user.save();
    await target.save();
    return { message: 'Unfollowed' };
  }

  async getFollowers(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('followers', 'username avatarUrl bio')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user.followers;
  }

  async getFollowing(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('following', 'username avatarUrl bio')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user.following;
  }

  // Add these methods to your UsersService
  async findAllUsers( ) {
    // const skip = (page - 1) * limit;

    // const query = search ? { username: { $regex: search, $options: 'i' } } : {};

    const users = await this.userModel
      .select('username avatarUrl bio followers following')
      .exec();

    const total = await this.userModel.countDocuments(query);

    return {
      users,
    };
  }

  async getDiscoverUsers(userId: string) {
    // Get users that the current user is not following
    const user = await this.userModel.findById(userId);
    const followingIds = user.following.map((id) => id.toString());

    const users = await this.userModel
      .find({
        _id: { $ne: userId, $nin: user.following },
      })
      .select('username avatarUrl bio followersCount followingCount')
      .limit(20)
      .exec();

    return users;
  }

  async checkIfFollowing(userId: string, targetId: string) {
    const user = await this.userModel.findById(userId);
    return user.following.some((id) => id.toString() === targetId);
  }
}
