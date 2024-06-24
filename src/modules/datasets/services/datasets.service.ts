import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dataset } from '../../../models/dataset.model';
import { AccessRequest } from '../../../models/access-request.model';
import axios from 'axios';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel(Dataset)
    private datasetModel: typeof Dataset,
    @InjectModel(AccessRequest)
    private accessRequestModel: typeof AccessRequest,
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

  async getDatasetData(name: string, frequency: string, user_id: string): Promise<any> {
    const nameToIdMap: { [key: string]: string } = {
      bitcoin: 'bitcoin',
      ethereum: 'ethereum',
    };
    
    const baseId = nameToIdMap[name.toLowerCase()];
    
    if (!baseId) {
      throw new Error('Invalid dataset name');
    }

    const validFrequencies = ['h1', 'd1', 'mn',]; 
    if (!validFrequencies.includes(frequency)) {
      throw new Error('Invalid frequency');
    }

    const accessRequest = await this.accessRequestModel.findOne({
      where: { user_id, dataset_id: baseId, frequency, status: 'approved' },
    });

    if (!accessRequest) {
      throw new UnauthorizedException('User does not have access to this dataset or frequency');
    }

    const response = await axios.get(`https://api.coincap.io/v2/assets/${baseId}/history?interval=${frequency}`)
    const datasetData = await response.data;
    return datasetData;
  }
}
