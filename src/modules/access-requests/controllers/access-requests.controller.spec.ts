import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestsController } from './access-requests.controller';
import { AccessRequestsService } from '../services/access-requests.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('AccessRequestsController', () => {
  let controller: AccessRequestsController;
  let accessRequestsService: AccessRequestsService;

  const userId = 'user1';
  const datasetId = 'dataset1';
  const frequencyId = 'frequency1';

  const createDto: CreateAccessRequestDto = {
    userId,
    datasetId,
    frequencyId,
    status: 'pending',
    requestedAt: new Date(),
  };

  const updateDto: UpdateAccessRequestDto = { status: 'approved' };

  const createdAccessRequest = { id: '1', ...createDto };
  const expectedAccessRequest = { id: '1', userId, datasetId, frequencyId, status: 'pending' };
  const revokedAccessRequest = { id: '1', userId, datasetId, frequencyId, status: 'revoked' };
  const expectedAccessRequests = [expectedAccessRequest];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessRequestsController],
      providers: [
        {
          provide: AccessRequestsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findPendingRequests: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            revokeAccess: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccessRequestsController>(AccessRequestsController);
    accessRequestsService = module.get<AccessRequestsService>(AccessRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an access request', async () => {
      jest.spyOn(accessRequestsService, 'create').mockResolvedValue(createdAccessRequest as any);

      const result = await controller.create(createDto);
      expect(result).toEqual(createdAccessRequest);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'create').mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of access requests', async () => {
      jest.spyOn(accessRequestsService, 'findAll').mockResolvedValue(expectedAccessRequests as any);

      const result = await controller.findAll();
      expect(result).toEqual(expectedAccessRequests);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'findAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findPendingRequests', () => {
    it('should return an array of pending access requests', async () => {
      jest.spyOn(accessRequestsService, 'findPendingRequests').mockResolvedValue(expectedAccessRequests as any);

      const result = await controller.findPendingRequests();
      expect(result).toEqual(expectedAccessRequests);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'findPendingRequests').mockRejectedValue(new Error('Service error'));

      await expect(controller.findPendingRequests()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return an access request if found', async () => {
      jest.spyOn(accessRequestsService, 'findOne').mockResolvedValue(expectedAccessRequest as any);

      const result = await controller.findOne(userId, datasetId, frequencyId);
      expect(result).toEqual(expectedAccessRequest);
    });

    it('should throw NotFoundException if access request is not found', async () => {
      jest.spyOn(accessRequestsService, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(userId, datasetId, frequencyId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'findOne').mockRejectedValue(new Error('Service error'));

      await expect(controller.findOne(userId, datasetId, frequencyId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update an access request', async () => {
      const updatedAccessRequest = { id: '1', userId, datasetId, frequencyId, ...updateDto };
      jest.spyOn(accessRequestsService, 'update').mockResolvedValue(updatedAccessRequest as any);

      const result = await controller.update(userId, datasetId, frequencyId, updateDto);
      expect(result).toEqual(updatedAccessRequest);
    });

    it('should throw NotFoundException if access request is not found', async () => {
      jest.spyOn(accessRequestsService, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(userId, datasetId, frequencyId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'update').mockRejectedValue(new Error('Service error'));

      await expect(controller.update(userId, datasetId, frequencyId, updateDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('revokeAccess', () => {
    it('should revoke access', async () => {
      jest.spyOn(accessRequestsService, 'revokeAccess').mockResolvedValue(revokedAccessRequest as any);

      const result = await controller.revokeAccess(userId, datasetId, frequencyId);
      expect(result).toEqual(revokedAccessRequest);
    });

    it('should throw NotFoundException if access request is not found', async () => {
      jest.spyOn(accessRequestsService, 'revokeAccess').mockRejectedValue(new NotFoundException());

      await expect(controller.revokeAccess(userId, datasetId, frequencyId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'revokeAccess').mockRejectedValue(new Error('Service error'));

      await expect(controller.revokeAccess(userId, datasetId, frequencyId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove an access request', async () => {
      jest.spyOn(accessRequestsService, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(userId, datasetId, frequencyId);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if access request is not found', async () => {
      jest.spyOn(accessRequestsService, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(userId, datasetId, frequencyId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(accessRequestsService, 'remove').mockRejectedValue(new Error('Service error'));

      await expect(controller.remove(userId, datasetId, frequencyId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
