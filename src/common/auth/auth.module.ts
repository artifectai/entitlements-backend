import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/services/config.service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    CustomConfigModule,
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.getJwtSecret();
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
