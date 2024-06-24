import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { User } from '../../../models/user.model';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let jwtService: JwtService;
  let userModel: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [{ id: '1', apiKey: 'abc', role: 'admin' }];
      jest.spyOn(userModel, 'findAll').mockResolvedValue(expectedUsers as User[]);

      const result = await service.findAll();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findByApiKey', () => {
    it('should return a user if found', async () => {
      const expectedUser = { id: '1', apiKey: 'abc', role: 'admin' };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(expectedUser as User);

      const result = await service.findByApiKey('abc');
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.findByApiKey('abc')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateToken', () => {
    it('should return a signed token', async () => {
      const expectedUser = { id: '1', apiKey: 'abc', role: 'admin' };
      const token = 'signed-token';
      jest.spyOn(userModel, 'findOne').mockResolvedValue(expectedUser as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.generateToken('abc');
      expect(result).toEqual(token);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.generateToken('abc')).rejects.toThrow('User not found');
    });
  });

  describe('validateToken', () => {
    it('should return a user if token is valid', async () => {
      const expectedUser = { id: '1', apiKey: 'abc', role: 'admin' };
      const token = 'valid-token';
      const decodedToken = { apiKey: 'abc', sub: '1' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
      jest.spyOn(service, 'findByApiKey').mockResolvedValue(expectedUser as User);

      const result = await service.validateToken(token);
      expect(result).toEqual(expectedUser);
    });

    it('should throw an error if token is invalid or expired', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid or expired token');
      });

      await expect(service.validateToken('invalid-token')).rejects.toThrow('Invalid or expired token');
    });
  });
});
