import { Controller, Get, Post, Body, Headers, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../../../models/user.model';
import { Public } from '../../../common/auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Public()
  @Post('generate-token')
  async generateToken(@Body('apiKey') apiKey: string): Promise<string> {
    const token = await this.usersService.generateToken(apiKey);
    return token;
  }

  @Public()
  @Get('validate')
  async validateUser(@Headers('Authorization') authHeader: string): Promise<User> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const user = await this.usersService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('User not found or token is invalid');
    }
    return user;
  }
}
