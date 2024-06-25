import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dataset } from '../../../models/dataset.model';
import { AccessRequest } from '../../../models/access-request.model';
import { Frequency } from '../../../models/frequency.model';
import axios from 'axios';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel(Dataset)
    private datasetModel: typeof Dataset,
    @InjectModel(AccessRequest)
    private accessRequestModel: typeof AccessRequest,
    @InjectModel(Frequency)
    private frequencyModel: typeof Frequency,
  ) {}

  async findAll(): Promise<Dataset[]> {
    try {
      return await this.datasetModel.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve datasets');
    }
  }

  async findBySymbol(symbol: string): Promise<Dataset[]> {
    try {
      return await this.datasetModel.findAll({ where: { symbol } });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve datasets with symbol ${symbol}`);
    }
  }

  async getSpecificPricingData(name: string): Promise<any> {
    try {
      const response = await axios.get(`https://api.coincap.io/v2/assets/${name.toLowerCase()}`);
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve pricing data for ${name}`);
    }
  }

  async getDatasetData(name: string, frequency: string, userId: string): Promise<any> {
    try {
      const capitalizedDatasetName = capitalize(name);
      const dataset = await this.datasetModel.findOne({ where: { name:capitalizedDatasetName } });
      if (!dataset) {
        throw new NotFoundException('Invalid dataset name');
      }

      const validFrequency = await this.frequencyModel.findOne({ where: { datasetId: dataset.id, frequency } });
      if (!validFrequency) {
        throw new NotFoundException('Invalid frequency');
      }

      const accessRequest = await this.accessRequestModel.findOne({
        where: { userId, datasetId: dataset.id, frequencyId: validFrequency.id, status: 'approved' },
      });
      if (!accessRequest) {
        throw new UnauthorizedException('User does not have access to this dataset or frequency');
      }
      
      const response = await axios.get(`https://api.coincap.io/v2/assets/${dataset.name.toLowerCase()}/history?interval=${frequency}`);

      return response.data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to retrieve dataset data');
      }
    }

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
 }
}
