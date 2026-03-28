import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import { PublicUser } from './dto/public-user.dto';
import {
  SearchHistory,
  SearchHistoryDocument,
} from './schemas/search-history.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(SearchHistory.name)
    private readonly searchHistoryModel: Model<SearchHistoryDocument>,
  ) {}

  async create(registerDto: RegisterDto): Promise<PublicUser> {
    const existingUser = await this.userModel.exists({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const createdUser = await this.userModel.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    return this.toPublicUser(createdUser);
  }

  async validateUser(email: string, password: string): Promise<PublicUser> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.toPublicUser(user);
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.toPublicUser(user);
  }

  async addSearchHistory(userId: string, city: string) {
    await this.searchHistoryModel.create({
      userId: new Types.ObjectId(userId),
      city,
    });
  }

  async getSearchHistory(userId: string) {
    const history = await this.searchHistoryModel
      .find({
        userId: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .exec();

    return history.map((item) => ({
      id: String(item._id),
      city: item.city,
      createdAt: item.createdAt?.toISOString() ?? new Date().toISOString(),
    }));
  }

  private toPublicUser(user: UserDocument): PublicUser {
    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  }
}
