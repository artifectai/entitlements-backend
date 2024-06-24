import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findByApiKey(apiKey: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { apiKey } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async generateToken(apiKey: string): Promise<string> {
    const user = await this.userModel.findOne({ where: { apiKey } });
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { apiKey: user.apiKey, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return this.findByApiKey(decoded.apiKey);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
