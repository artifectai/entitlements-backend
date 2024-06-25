import { ConfigService } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';
import { User } from '../../models/user.model';
import { Dataset } from '../../models/dataset.model';
import { AccessRequest } from '../../models/access-request.model';
import { Frequency } from '../../models/frequency.model';

export const getSequelizeConfig = (configService: ConfigService): SequelizeOptions => {
  const host = configService.get<string>('DB_HOST');
  const port = parseInt(configService.get<string>('DB_PORT') || '0', 10);
  const username = configService.get<string>('DB_USER');
  const password = configService.get<string>('DB_PASS');
  const database = configService.get<string>('DB_NAME');

  if (!host || !port || !username || !password || !database) {
    throw new Error('Database configuration is not complete. Please set all required environment variables.');
  }

  return {
    dialect: 'postgres',
    host,
    port,
    username,
    password,
    database,
    models: [User, Dataset, AccessRequest, Frequency],
  } as SequelizeOptions;
};
