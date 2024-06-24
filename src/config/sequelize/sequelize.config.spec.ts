import { getSequelizeConfig } from './sequelize.config';
import { ConfigService } from '@nestjs/config';

describe('getSequelizeConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        const config = {
          DB_HOST: 'localhost',
          DB_PORT: '5432',
          DB_USER: 'test_user',
          DB_PASS: 'test_pass',
          DB_NAME: 'test_db',
        };
        return config[key];
      }),
    } as unknown as ConfigService;
  });

  it('should return a valid Sequelize config', () => {
    const config = getSequelizeConfig(configService);

    expect(config).toEqual({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test_user',
      password: 'test_pass',
      database: 'test_db',
      models: expect.any(Array),
    });
  });

  it('should throw an error if configuration is incomplete', () => {
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      const config = {
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USER: 'test_user',
        DB_PASS: 'test_pass',
        DB_NAME: undefined,
      };
      return config[key];
    });

    expect(() => getSequelizeConfig(configService)).toThrow('Database configuration is not complete. Please set all required environment variables.');
  });
});
