import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../../../models/user.model';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
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

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [{ id: '1', apiKey: 'abc', role: 'admin' }];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(expectedUsers as User[]);

      const result = await controller.findAll();
      expect(result).toEqual(expectedUsers);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('generateToken', () => {
    it('should return a token', async () => {
      const apiKey = 'abc';
      const token = 'signed-token';
      jest.spyOn(usersService, 'generateToken').mockResolvedValue(token);

      const result = await controller.generateToken(apiKey);
      expect(result).toEqual(token);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      const apiKey = 'abc';
      jest.spyOn(usersService, 'generateToken').mockRejectedValue(new Error('Service error'));

      await expect(controller.generateToken(apiKey)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUser', () => {
    it('should return a user if token is valid', async () => {
      const authHeader = 'Bearer valid-token';
      const token = 'valid-token';
      const expectedUser = { id: '1', apiKey: 'abc', role: 'admin' };
      jest.spyOn(usersService, 'validateToken').mockResolvedValue(expectedUser as User);

      const result = await controller.validateUser(authHeader);
      expect(result).toEqual(expectedUser);
    });

    it('should throw UnauthorizedException if Authorization header is missing', async () => {
      await expect(controller.validateUser('')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is missing in the Authorization header', async () => {
      const authHeader = 'Bearer ';
      await expect(controller.validateUser(authHeader)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const authHeader = 'Bearer invalid-token';
      jest.spyOn(usersService, 'validateToken').mockRejectedValue(new Error('Invalid token'));

      await expect(controller.validateUser(authHeader)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if service throws an error', async () => {
      const authHeader = 'Bearer valid-token';
      jest.spyOn(usersService, 'validateToken').mockRejectedValue(new Error('Service error'));

      await expect(controller.validateUser(authHeader)).rejects.toThrow(UnauthorizedException);
    });
  });
});
