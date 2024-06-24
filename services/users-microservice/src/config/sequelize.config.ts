import { ConfigService } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';
import { User } from '../users/models/user.model';

export const getSequelizeConfig = (configService: ConfigService): SequelizeOptions => {
  const host = configService.get<string>('DB_HOST');
  const port = Number(configService.get<string>('DB_PORT'));
  const username = configService.get<string>('DB_USER');
  const password = configService.get<string>('DB_PASS');
  const database = configService.get<string>('DB_NAME');

  const sequelizeConfig: SequelizeOptions = {
    dialect: 'postgres',
    host,
    port,
    username,
    password,
    database,
    models: [User]
  };

  if (!host || !port || !username || !password || !database) {
    throw new Error('Database configuration is not complete. Please set all required environment variables.');
  }

  return sequelizeConfig;
};

