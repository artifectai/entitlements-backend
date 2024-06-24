import { Op } from 'sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AccessRequestsService } from './access-requests.service';
import { AccessRequest } from '../../../models/access-request.model';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';

const mockAccessRequest = {
  user_id: 1,
  dataset_id: 1,
  frequency: 'daily',
  status: 'pending',
  requested_at: new Date(),
  resolved_at: null,
  expiry_date: null,
  is_temporary: false,
  save: jest.fn().mockResolvedValue(null),
  destroy: jest.fn().mockResolvedValue(null),
};

const mockAccessRequestModel = {
  build: jest.fn().mockReturnValue(mockAccessRequest),
  save: jest.fn().mockResolvedValue(mockAccessRequest),
  findAll: jest.fn().mockResolvedValue([mockAccessRequest]),
  findOne: jest.fn().mockResolvedValue(mockAccessRequest),
  update: jest.fn().mockResolvedValue([1, [mockAccessRequest]]),
};

const mockNotificationsService = {
  sendNotification: jest.fn(),
};

describe('AccessRequestsService', () => {
  let service: AccessRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestsService,
        {
          provide: getModelToken(AccessRequest),
          useValue: mockAccessRequestModel,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<AccessRequestsService>(AccessRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an access request', async () => {
      const dto: CreateAccessRequestDto = {
        user_id: 1,
        dataset_id: 1,
        frequency: 'daily',
        status: 'pending',
        requested_at: new Date(),
        resolved_at: null,
        expiry_date: null,
        is_temporary: false,
      };

      // Set up the mock to return the correct value when save is called
      mockAccessRequest.save.mockResolvedValueOnce(mockAccessRequest);

      const result = await service.create(dto);

      expect(mockAccessRequestModel.build).toHaveBeenCalledWith(dto);
      expect(mockAccessRequest.save).toHaveBeenCalled();
      expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith({
        type: 'NEW_ACCESS_REQUEST',
        message: `New access request from user 1 for dataset 1 (daily)`,
        accessRequest: mockAccessRequest,
      });
      expect(result).toEqual(mockAccessRequest);
    });
  });

  describe('findAll', () => {
    it('should return all access requests', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAccessRequest]);
      expect(mockAccessRequestModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findPendingRequests', () => {
    it('should return all pending access requests', async () => {
      const result = await service.findPendingRequests();
      expect(result).toEqual([mockAccessRequest]);
      expect(mockAccessRequestModel.findAll).toHaveBeenCalledWith({ where: { status: 'pending' } });
    });
  });

  describe('findOne', () => {
    it('should return a single access request', async () => {
      const result = await service.findOne(1, 1, 'daily');
      expect(result).toEqual(mockAccessRequest);
      expect(mockAccessRequestModel.findOne).toHaveBeenCalledWith({
        where: { user_id: 1, dataset_id: 1, frequency: 'daily' },
      });
    });

    it('should throw a NotFoundException if access request not found', async () => {
      mockAccessRequestModel.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1, 1, 'daily')).rejects.toThrow('Access request not found');
    });
  });

  describe('update', () => {
    it('should update an access request', async () => {
      const dto: UpdateAccessRequestDto = {
        status: 'approved',
      };

      const result = await service.update(1, 1, 'daily', 'approved', dto);

      expect(result).toEqual([1, [mockAccessRequest]]);
      expect(mockAccessRequestModel.update).toHaveBeenCalledWith(dto, {
        where: { user_id: 1, dataset_id: 1, frequency: 'daily' },
        returning: true,
      });
      expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith({
        type: 'ACCESS_REQUEST_UPDATED',
        message: `Your access request for dataset 1 and frequency daily has been approved.`,
        accessRequest: mockAccessRequest,
      });
    });

    it('should throw a NotFoundException if access request not found', async () => {
      mockAccessRequestModel.update.mockResolvedValueOnce([0, []]);
      const dto: UpdateAccessRequestDto = {
        status: 'approved',
      };
      await expect(service.update(1, 1, 'daily', 'approved', dto)).rejects.toThrow('Access request not found');
    });
  });

  describe('remove', () => {
    it('should remove an access request', async () => {
      await service.remove(1, 1, 'daily');
      expect(mockAccessRequestModel.findOne).toHaveBeenCalledWith({
        where: { user_id: 1, dataset_id: 1, frequency: 'daily' },
      });
      expect(mockAccessRequest.destroy).toHaveBeenCalled();
    });
  });

  describe('revokeAccess', () => {
    it('should revoke an access request', async () => {
      await service.revokeAccess(1, 1, 'daily');
      expect(mockAccessRequestModel.findOne).toHaveBeenCalledWith({
        where: { user_id: 1, dataset_id: 1, frequency: 'daily' },
      });
      expect(mockAccessRequest.save).toHaveBeenCalled();
      expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith({
        type: 'ACCESS_REVOKED',
        message: `Your access for dataset 1 and frequency daily has been revoked.`,
        accessRequest: mockAccessRequest,
      });
    });

    it('should throw a NotFoundException if access request not found', async () => {
      mockAccessRequestModel.findOne.mockResolvedValueOnce(null);
      await expect(service.revokeAccess(1, 1, 'daily')).rejects.toThrow('Access request not found');
    });
  });

  describe('checkExpiredAccessRequests', () => {
    it('should check and expire access requests', async () => {
      const expiredRequest = { ...mockAccessRequest, expiry_date: new Date(Date.now() - 1000) };
      mockAccessRequestModel.findAll.mockResolvedValueOnce([expiredRequest]);

      await service.checkExpiredAccessRequests();

      expect(mockAccessRequestModel.findAll).toHaveBeenCalledWith({
        where: {
          expiry_date: { [Op.lt]: new Date() },
          status: 'approved',
          is_temporary: true,
        },
      });
      expect(expiredRequest.save).toHaveBeenCalled();
      expect(mockNotificationsService.sendNotification).toHaveBeenCalledWith({
        type: 'ACCESS_EXPIRED',
        message: `Your temporary access for dataset 1 and frequency daily has expired.`,
        accessRequest: expiredRequest,
      });
    });
  });
});
