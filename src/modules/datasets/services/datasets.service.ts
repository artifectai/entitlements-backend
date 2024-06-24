import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    return this.datasetModel.findAll();
  }

  async findBySymbol(symbol: string): Promise<Dataset[]> {
    return this.datasetModel.findAll({ where: { symbol } });
  }

  async getSpecificPricingData(name: string): Promise<any> {
    const response = await axios.get(`https://api.coincap.io/v2/assets/${name.toLowerCase()}`);
    const pricingData = await response.data;
    return pricingData;
  }

  async getDatasetData(name: string, frequency: string, userId: string): Promise<any> {
    const dataset = await this.datasetModel.findOne({ where: { name } });

    if (!dataset) {
      throw new Error('Invalid dataset name');
    }

    const validFrequency = await this.frequencyModel.findOne({ where: { datasetId: dataset.id, frequency } });

    if (!validFrequency) {
      throw new Error('Invalid frequency');
    }

    const accessRequest = await this.accessRequestModel.findOne({
      where: { userId, datasetId: dataset.id, frequencyId: validFrequency.id, status: 'approved' },
    });

    if (!accessRequest) {
      throw new UnauthorizedException('User does not have access to this dataset or frequency');
    }

    const response = await axios.get(`https://api.coincap.io/v2/assets/${dataset.symbol.toLowerCase()}/history?interval=${frequency}`);
    const datasetData = await response.data;
    return datasetData;
  }
}
