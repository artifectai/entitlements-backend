import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get(key: string): string | undefined {
    return this.configService.get<string>(key);
  }

  getDatabaseUser(): string | undefined {
    return this.configService.get<string>('DB_USER');
  }

  getJwtSecret(): string | undefined {
    return this.configService.get('JWT_SECRET');
  }
}
