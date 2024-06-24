import { Controller, Get, Post, Body, Headers, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../../../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Post('generate-token')
  async generateToken(@Body('apiKey') apiKey: string): Promise<string> {
    try {
      const token = await this.usersService.generateToken(apiKey);
      return token;
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate token');
    }
  }

  @Get('validate')
  async validateUser(@Headers('Authorization') authHeader: string): Promise<User> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const user = await this.usersService.validateToken(token);
      if (!user) {
        throw new UnauthorizedException('User not found or token is invalid');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Failed to validate user');
    }
  }
}
