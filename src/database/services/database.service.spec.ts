import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                DB_USER: 'test_user',
                DB_HOST: 'localhost',
                DB_PORT: '5432',
                DB_PASS: 'test_pass',
                DB_NAME: 'test_db',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return database connection options', () => {
    const options = service.getDatabaseConnectionOptions();
    expect(options).toEqual({
      user: 'test_user',
      host: 'localhost',
      port: 5432,
      password: 'test_pass',
      database: 'test_db',
    });
  });
});
