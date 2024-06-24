import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { User } from '../../../models/user.model';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 1,
  api_key: 'test_api_key',
  role: 'test_role',
  created_at: new Date(),
};

const mockUserModel = {
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockImplementation((query) => {
    if (query.where.api_key === mockUser.api_key) {
      return Promise.resolve(mockUser);
    }
    return Promise.resolve(null);
  }),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('test_token'),
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'test_token') {
      return { api_key: mockUser.api_key, sub: mockUser.id };
    }
    throw new Error('Invalid token');
  }),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findByApiKey', () => {
    it('should return a user if found', async () => {
      const result = await service.findByApiKey(mockUser.api_key);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.findByApiKey('wrong_api_key')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateToken', () => {
    it('should return a token', async () => {
      const result = await service.generateToken(mockUser.api_key);
      expect(result).toEqual('test_token');
    });

    it('should throw an error if user not found', async () => {
      await expect(service.generateToken('wrong_api_key')).rejects.toThrow(Error);
    });
  });

  describe('validateToken', () => {
    it('should return a user if token is valid', async () => {
      const result = await service.validateToken('test_token');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if token is invalid', async () => {
      await expect(service.validateToken('invalid_token')).rejects.toThrow(Error);
    });
  });
});
