import { Controller, Get, Param, UnauthorizedException, Headers, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DatasetsService } from '../services/datasets.service';
import { Dataset } from '../../../models/dataset.model';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  async findAll(): Promise<Dataset[]> {
    try {
      return await this.datasetsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve datasets');
    }
  }

  @Get(':symbol')
  async findBySymbol(@Param('symbol') symbol: string): Promise<Dataset[]> { 
    try {
      if (!symbol) {
        throw new BadRequestException('Symbol parameter is required');
      }
      return await this.datasetsService.findBySymbol(symbol);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to retrieve datasets with symbol ${symbol}`);
    }
  }

  @Get(':name/pricing')
  async getPricingData(@Param('name') name: string): Promise<any> {
    try {
      if (!name) {
        throw new BadRequestException('Name parameter is required');
      }
      return await this.datasetsService.getSpecificPricingData(name);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to retrieve pricing data for ${name}`);
    }
  }

  @Get(':name/:frequency/data')
  async getDataset(
    @Param('name') name: string,
    @Param('frequency') frequency: string,
    @Headers('userId') userId: string
  ): Promise<any> {
    try {
      if (!name || !frequency || !userId) {
        throw new BadRequestException('Name, frequency, and userId parameters are required');
      }

      return await this.datasetsService.getDatasetData(name, frequency, userId);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to retrieve dataset data for ${name} with frequency ${frequency}`);
    }
  }
}
