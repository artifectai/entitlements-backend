import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestsController } from './access-requests.controller';
import { AccessRequestsService } from '../services/access-requests.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UpdateAccessRequestDto } from '../dto/update-access-request.dto';

describe('AccessRequestsController', () => {
  let controller: AccessRequestsController;
  let service: AccessRequestsService;

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
    service = module.get<AccessRequestsService>(AccessRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call AccessRequestsService.create with the correct parameters', async () => {
      const createAccessRequestDto: CreateAccessRequestDto = {
        user_id: 1,
        dataset_id: 1,
        frequency: 'daily',
        status: 'pending',
        requested_at: new Date(),
      };
      await controller.create(createAccessRequestDto);
      expect(service.create).toHaveBeenCalledWith(createAccessRequestDto);
    });
  });

  describe('findAll', () => {
    it('should call AccessRequestsService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findPendingRequests', () => {
    it('should call AccessRequestsService.findPendingRequests', async () => {
      await controller.findPendingRequests();
      expect(service.findPendingRequests).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call AccessRequestsService.findOne with the correct parameters', async () => {
      const user_id = 1;
      const dataset_id = 1;
      const frequency = 'daily';
      await controller.findOne(user_id, dataset_id, frequency);
      expect(service.findOne).toHaveBeenCalledWith(user_id, dataset_id, frequency);
    });
  });

  describe('update', () => {
    it('should call AccessRequestsService.update with the correct parameters', async () => {
      const user_id = 1;
      const dataset_id = 1;
      const frequency = 'daily';
      const status = 'approved';
      const updateAccessRequestDto: UpdateAccessRequestDto = { status: 'approved' };
      await controller.update(user_id, dataset_id, frequency, status, updateAccessRequestDto);
      expect(service.update).toHaveBeenCalledWith(user_id, dataset_id, frequency, status, updateAccessRequestDto);
    });
  });

  describe('revokeAccess', () => {
    it('should call AccessRequestsService.revokeAccess with the correct parameters', async () => {
      const user_id = 1;
      const dataset_id = 1;
      const frequency = 'daily';
      await controller.revokeAccess(user_id, dataset_id, frequency);
      expect(service.revokeAccess).toHaveBeenCalledWith(user_id, dataset_id, frequency);
    });
  });

  describe('remove', () => {
    it('should call AccessRequestsService.remove with the correct parameters', async () => {
      const user_id = 1;
      const dataset_id = 1;
      const frequency = 'daily';
      await controller.remove(user_id, dataset_id, frequency);
      expect(service.remove).toHaveBeenCalledWith(user_id, dataset_id, frequency);
    });
  });
});

