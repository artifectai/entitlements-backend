import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { CustomConfigModule } from './config/config.module';
import { getSequelizeConfig } from './config/sequelize.config';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { User } from './users/models/user.model';

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    SequelizeModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getSequelizeConfig(configService)
    }),
    SequelizeModule.forFeature([User]),
    UsersModule
  ],
  providers: [DatabaseService],

})

export class AppModule {}
