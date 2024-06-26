import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthCheckService, HttpHealthIndicator, HealthCheckResult } from '@nestjs/terminus';

describe('HealthService', () => {
  let service: HealthService;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should perform health check', async () => {
    const result: HealthCheckResult = { 
      status: 'ok', 
      info: { 'nestjs-docs': { status: 'up' } },
      error: {},
      details: { 'nestjs-docs': { status: 'up' } }
    };

    const pingCheckMock = jest.fn().mockResolvedValue({ 'nestjs-docs': { status: 'up' } });
    const checkMock = jest.fn().mockImplementation(async (checks) => {
      for (const check of checks) {
        await check();
      }
      return result;
    });

    httpHealthIndicator.pingCheck = pingCheckMock;
    healthCheckService.check = checkMock;

    const checkResult = await service.check();
    expect(checkResult).toBe(result);
    expect(healthCheckService.check).toHaveBeenCalled();
    expect(pingCheckMock).toHaveBeenCalledWith('nestjs-docs', 'https://docs.nestjs.com');
  });
});

