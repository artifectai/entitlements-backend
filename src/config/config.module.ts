import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigService } from './services/config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`, 
        '.env', 
      ],
    }),
  ],
  providers: [ConfigService, NestConfigService],
  exports: [ConfigService, NestConfigService],
})
export class CustomConfigModule {}