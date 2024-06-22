import { ConfigService } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Dataset } from '../models/dataset.model';
import { AccessRequest } from '../models/access-request.model';

export const getSequelizeConfig = (configService: ConfigService): SequelizeOptions => {
  const host = configService.get<string>('DB_HOST');
  const port = Number(configService.get<string>('DB_PORT'));
  const username = configService.get<string>('DB_USER');
  const password = configService.get<string>('DB_PASS');
  const database = configService.get<string>('DB_NAME');

  console.log('DB_HOST:', host);
  console.log('DB_PORT:', port);
  console.log('DB_USER:', username);
  console.log('DB_PASS:', password);
  console.log('DB_NAME:', database);

  const sequelizeConfig: SequelizeOptions = {
    dialect: 'postgres',
    host,
    port,
    username,
    password,
    database,
    models: [User, Dataset, AccessRequest],
  };

  if (!host || !port || !username || !password || !database) {
    throw new Error('Database configuration is not complete. Please set all required environment variables.');
  }

  return sequelizeConfig;
};
