import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDatabaseConnectionOptions() {
    const user = this.configService.getDatabaseUser();
    const host = this.configService.get('DB_HOST');
    const port = this.configService.get('DB_PORT');
    const pass = this.configService.get('DB_PASS');
    const name = this.configService.get('DB_NAME');

    return {
      user,
      host,
      port: Number(port),
      password: pass,
      database: name,
    };
  }
}
