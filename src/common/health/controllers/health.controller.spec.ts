import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from '../services/health.service';
import { HealthCheckResult } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call health service check method', async () => {
    const result: HealthCheckResult = { 
      status: 'ok', 
      info: { 'nestjs-docs': { status: 'up' } },
      error: {},
      details: { 'nestjs-docs': { status: 'up' } }
    };
    jest.spyOn(healthService, 'check').mockImplementation(async () => result);
    expect(await controller.check()).toBe(result);
    expect(healthService.check).toHaveBeenCalled();
  });
});
