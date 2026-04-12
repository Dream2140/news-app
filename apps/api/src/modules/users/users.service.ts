import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { CommentsService } from '../comments/comments.service';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => CommentsService)) private commentsService: CommentsService,
  ) {}

  async create(dto: CreateUserDto, activationLink: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    return this.userModel.create({
      ...dto,
      password: hashedPassword,
      activationLink,
    });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(page: number, limit: number) {
    if (limit === -1) {
      return this.userModel.find().select('-password').exec();
    }

    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      this.userModel.find().select('-password').skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(),
    ]);

    return {
      docs,
      totalDocs,
      page,
      limit,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: skip + limit < totalDocs,
      hasPrevPage: page > 1,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one field is required');
    }

    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true }).select('-password');

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Wrong password');
    }

    user.password = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.commentsService.deleteByUserId(id);
    return { message: `User ${id} deleted successfully` };
  }

  async deleteAll(): Promise<{ message: string }> {
    const result = await this.userModel.deleteMany();
    return { message: `${result.deletedCount} users deleted` };
  }

  async activate(activationLink: string): Promise<void> {
    const user = await this.userModel.findOne({ activationLink });
    if (!user) {
      throw new BadRequestException('Invalid activation link');
    }
    user.isActivated = true;
    user.activationLink = undefined;
    await user.save();
  }

  async validatePassword(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Wrong password');
    }

    return user;
  }

  async setResetToken(email: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return { token: '' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return { token };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}
