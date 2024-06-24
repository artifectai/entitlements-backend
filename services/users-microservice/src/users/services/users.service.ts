import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    private sequelize: Sequelize
  ) {}

  async findAll(): Promise<User[]> {
    console.log('Executing findAll query');
    const users = await this.userModel.findAll();
    console.log('Users:', users);
    return users
  }

  async findByApiKey(api_key: string): Promise<User> {
    return this.userModel.findOne({ where: { api_key } });
  }

  async generateToken(api_key: string): Promise<string> {
    const user = await this.userModel.findOne({ where: { api_key } });
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { api_key: user.api_key, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      return this.findByApiKey(decoded.api_key);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
}
