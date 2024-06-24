// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../models/user.model';
import { NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

const mockUserModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
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
      const result = [new User()];
      mockUserModel.findAll.mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
    });

    it('should throw an error if unable to retrieve users', async () => {
      mockUserModel.findAll.mockRejectedValue(new Error());
      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByApiKey', () => {
    it('should return a user', async () => {
      const user = new User();
      mockUserModel.findOne.mockResolvedValue(user);
      expect(await service.findByApiKey('test_api_key')).toEqual(user);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(service.findByApiKey('test_api_key')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateToken', () => {
    it('should return a signed token', async () => {
      const user = new User();
      mockUserModel.findOne.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('signed_token');
      expect(await service.generateToken('test_api_key')).toEqual('signed_token');
    });
  });

  describe('validateToken', () => {
    it('should return a user if token is valid', async () => {
      const user = new User();
      mockJwtService.verify.mockReturnValue({ apiKey: 'test_api_key' });
      mockUserModel.findOne.mockResolvedValue(user);
      expect(await service.validateToken('test_token')).toEqual(user);
    });

    it('should throw an UnauthorizedException if token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      await expect(service.validateToken('test_token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
