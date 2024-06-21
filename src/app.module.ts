import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [ConfigModule],
  providers: [DatabaseService],
})

export class AppModule {}