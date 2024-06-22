import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.role = createUserDto.role;
    user.api_key = `api_key_${createUserDto.role.toLowerCase()}_${uuidv4()}`;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    return user.save();
  }

  async findByApiKey(api_key: string): Promise<User> {
    return this.userModel.findOne({ where: { api_key } });
  }

  // Optional methods for completeness

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
