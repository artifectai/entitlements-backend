import { Req, Controller, Get, Param, UnauthorizedException, Headers, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DatasetsService } from '../services/datasets.service';
import { Dataset } from '../../../models/dataset.model';
import { Roles } from '../../../common/auth/auth.decorator'

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  @Roles('Quant', 'Ops')
  async findAll(): Promise<Dataset[]> {
    return await this.datasetsService.findAll();
  }

  @Get(':symbol')
  @Roles('Quant', 'Ops')
  async findBySymbol(@Param('symbol') symbol: string): Promise<Dataset[]> { 
    if (!symbol) {
      throw new BadRequestException('Symbol parameter is required');
    }
    return await this.datasetsService.findBySymbol(symbol);
  }

  @Get(':name/pricing')
  @Roles('Quant', 'Ops')
  async getPricingData(@Param('name') name: string): Promise<any> {
    if (!name) {
      throw new BadRequestException('Name parameter is required');
    }
    return await this.datasetsService.getSpecificPricingData(name);
  }

  @Get(':name/:frequency/data')
  @Roles('Quant', 'Ops')
  async getDataset(
    @Param('name') name: string,
    @Param('frequency') frequency: string,
    @Req() req 
  ): Promise<any> {
    const userId = req.user.sub;
    
    if (!name || !frequency || !userId) {
      throw new BadRequestException('Name, frequency, and userId parameters are required');
    }

    return await this.datasetsService.getDatasetData(name, frequency, userId);
  }
}
