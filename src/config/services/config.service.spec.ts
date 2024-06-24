import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let nestConfigService: NestConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: NestConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                DB_USER: 'test_user',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    nestConfigService = module.get<NestConfigService>(NestConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a config value', () => {
    const dbUser = service.getDatabaseUser();
    expect(dbUser).toBe('test_user');
  });

  it('should return undefined for non-existing key', () => {
    const value = service.get('NON_EXISTING_KEY');
    expect(value).toBeUndefined();
  });
});
