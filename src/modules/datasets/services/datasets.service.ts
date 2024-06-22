import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dataset } from '../../../models/dataset.model';
import axios from 'axios';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel(Dataset)
    private datasetModel: typeof Dataset,
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

  async getDatasetData(name: string, frequency: string): Promise<any> {
    const response = await axios.get(`https://api.coincap.io/v2/assets/${name.toLowerCase()}/history?interval=${frequency}`)
    const datasetData = await response.data;
    return datasetData;
  }

}
