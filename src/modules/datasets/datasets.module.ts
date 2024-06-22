import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatasetsService } from './services/datasets.service';
import { DatasetsController } from './controllers/datasets.controller';
import { Dataset } from '../../models/dataset.model';

@Module({
  imports: [SequelizeModule.forFeature([Dataset])],
  providers: [DatasetsService],
  controllers: [DatasetsController],
  exports: [DatasetsService],
})
export class DatasetsModule {}
