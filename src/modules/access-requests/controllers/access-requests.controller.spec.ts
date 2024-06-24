import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestsController } from './access-requests.controller';
import { AccessRequestsService } from '../services/access-requests.service';
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
};

const mockAccessRequestsService = {
  create: jest.fn().mockResolvedValue(mockAccessRequest),
  findAll: jest.fn().mockResolvedValue([mockAccessRequest]),
  findPendingRequests: jest.fn().mockResolvedValue([mockAccessRequest]),
  findOne: jest.fn().mockResolvedValue(mockAccessRequest),
  update: jest.fn().mockResolvedValue([1, [mockAccessRequest]]),
  revokeAccess: jest.fn().mockResolvedValue(mockAccessRequest),
  remove: jest.fn().mockResolvedValue(mockAccessRequest),
};

describe('AccessRequestsController', () => {
  let controller: AccessRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessRequestsController],
      providers: [
        {
          provide: AccessRequestsService,
          useValue: mockAccessRequestsService,
        },
      ],
    }).compile();

    controller = module.get<AccessRequestsController>(AccessRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      expect(await controller.create(dto)).toEqual(mockAccessRequest);
      expect(mockAccessRequestsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of access requests', async () => {
      expect(await controller.findAll()).toEqual([mockAccessRequest]);
      expect(mockAccessRequestsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findPendingRequests', () => {
    it('should return an array of pending access requests', async () => {
      expect(await controller.findPendingRequests()).toEqual([mockAccessRequest]);
      expect(mockAccessRequestsService.findPendingRequests).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single access request', async () => {
      expect(await controller.findOne(1, 1, 'daily')).toEqual(mockAccessRequest);
      expect(mockAccessRequestsService.findOne).toHaveBeenCalledWith(1, 1, 'daily');
    });
  });

  describe('update', () => {
    it('should update an access request', async () => {
      const dto: UpdateAccessRequestDto = { status: 'approved' };

      expect(await controller.update(1, 1, 'daily', 'approved', dto)).toEqual([1, [mockAccessRequest]]);
      expect(mockAccessRequestsService.update).toHaveBeenCalledWith(1, 1, 'daily', 'approved', dto);
    });
  });

  describe('revokeAccess', () => {
    it('should revoke an access request', async () => {
      expect(await controller.revokeAccess(1, 1, 'daily')).toEqual(mockAccessRequest);
      expect(mockAccessRequestsService.revokeAccess).toHaveBeenCalledWith(1, 1, 'daily');
    });
  });

  describe('remove', () => {
    it('should remove an access request', async () => {
      expect(await controller.remove(1, 1, 'daily')).toEqual(mockAccessRequest);
      expect(mockAccessRequestsService.remove).toHaveBeenCalledWith(1, 1, 'daily');
    });
  });
});
