import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../../../models/user.model'; 

class MockUser {
  id: number;
  api_key: string;
  role: string;
  created_at: Date;

  constructor(id: number, api_key: string, role: string, created_at: Date) {
    this.id = id;
    this.api_key = api_key;
    this.role = role;
    this.created_at = created_at;
  }
}

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            generateToken: jest.fn(),
            validateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: MockUser[] = [
        new MockUser(1, 'key1', 'admin', new Date()),
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(result as unknown as User[]);

      expect(await usersController.findAll()).toBe(result);
    });
  });

  describe('generateToken', () => {
    it('should return a token', async () => {
      const result = 'jwt_token';
      const apiKey = 'key1';

      jest.spyOn(usersService, 'generateToken').mockResolvedValue(result);

      expect(await usersController.generateToken(apiKey)).toBe(result);
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      const user: MockUser = new MockUser(1, 'key1', 'admin', new Date());
      const token = 'jwt_token';
      const authHeader = `Bearer ${token}`;

      jest.spyOn(usersService, 'validateToken').mockResolvedValue(user as unknown as User);

      expect(await usersController.validateUser(authHeader)).toBe(user);
    });
  });
});
