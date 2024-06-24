import { Controller, Get, Param } from '@nestjs/common';
import { DatasetsService } from '../services/datasets.service';
import { Dataset } from '../../../models/dataset.model';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  async findAll(): Promise<Dataset[]> {
    return this.datasetsService.findAll();
  }

  @Get(':symbol')
  async findBySymbol(@Param('symbol') symbol: string): Promise<Dataset[]> { 
    return this.datasetsService.findBySymbol(symbol)
  }

  @Get(':name/pricing')
  async getPricingData(@Param('name') name: string): Promise<any> {
    return this.datasetsService.getSpecificPricingData(name);
  }

  @Get(':name/:frequency/data')
  async getDataset(
    @Param('name') name: string,
    @Param('frequency') frequency: string,
    @Param('user_id') user_id: number
    ): Promise<any> {
    return this.datasetsService.getDatasetData(name, frequency, user_id);
  }
}
