import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../../../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('generate-token')
  async generateToken(@Body('api_key') api_key: string): Promise<string> {
    const token = await this.usersService.generateToken(api_key);
    return token;
  }

  @Get('validate')
  async validateUser(@Headers('Authorization') authHeader: string): Promise<User> {
    const token = authHeader.split(' ')[1];
    const user = await this.usersService.validateToken(token);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
