import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessRequestsService } from './services/access-requests.service';
import { AccessRequestsController } from './controllers/access-requests.controller';
import { AccessRequest } from 'src/models/access-request.model';

@Module({
  imports: [SequelizeModule.forFeature([AccessRequest])], 
  providers: [AccessRequestsService], 
  controllers: [AccessRequestsController], 
  exports: [AccessRequestsService]
})
export class AccessRequestsModule {}
