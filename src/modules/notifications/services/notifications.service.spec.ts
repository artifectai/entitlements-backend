import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let gateway: NotificationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationsGateway,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    gateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should call NotificationsGateway.sendNotification with the correct parameters', () => {
      const notification = { type: 'NEW_ACCESS_REQUEST', message: 'New request' };

      service.sendNotification(notification);

      expect(gateway.sendNotification).toHaveBeenCalledWith(notification);
    });
  });
});
