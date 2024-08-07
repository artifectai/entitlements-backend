import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConnectionOptions } from '../../common/types'

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDatabaseConnectionOptions(): DatabaseConnectionOptions {
    const user = this.configService.get<string>('DB_USER');
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<string>('DB_PORT');
    const pass = this.configService.get<string>('DB_PASS');
    const name = this.configService.get<string>('DB_NAME');

    return {
      user,
      host,
      port: Number(port),
      password: pass,
      database: name,
    };
  }
}
