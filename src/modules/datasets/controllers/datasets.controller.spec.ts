import { Test, TestingModule } from '@nestjs/testing';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from '../services/datasets.service';
import { Dataset } from '../../../models/dataset.model';

const mockDataset = {
  id: 1,
  name: 'Bitcoin',
  symbol: 'BTC',
  frequency: 'd1',
  market_cap_usd: 1000000,
};

const mockDatasetsService = {
  findAll: jest.fn().mockResolvedValue([mockDataset]),
  findBySymbol: jest.fn().mockImplementation((symbol: string) => {
    if (symbol === mockDataset.symbol) {
      return Promise.resolve([mockDataset]);
    }
    return Promise.resolve([]);
  }),
  getSpecificPricingData: jest.fn().mockResolvedValue({ price: 50000 }),
  getDatasetData: jest.fn().mockResolvedValue({ data: 'sample data' }),
};

describe('DatasetsController', () => {
  let controller: DatasetsController;
  let service: DatasetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetsController],
      providers: [
        { provide: DatasetsService, useValue: mockDatasetsService },
      ],
    }).compile();

    controller = module.get<DatasetsController>(DatasetsController);
    service = module.get<DatasetsService>(DatasetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of datasets', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockDataset]);
    });
  });

  describe('findBySymbol', () => {
    it('should return an array of datasets with the given symbol', async () => {
      const result = await controller.findBySymbol(mockDataset.symbol);
      expect(result).toEqual([mockDataset]);
    });

    it('should return an empty array if no dataset is found with the given symbol', async () => {
      const result = await controller.findBySymbol('WRONG_SYMBOL');
      expect(result).toEqual([]);
    });
  });

  describe('getPricingData', () => {
    it('should return pricing data for the given name', async () => {
      const result = await controller.getPricingData(mockDataset.name);
      expect(result).toEqual({ price: 50000 });
    });
  });

  describe('getDataset', () => {
    it('should return dataset data for the given parameters', async () => {
      const result = await controller.getDataset(mockDataset.name, mockDataset.frequency, 'user_id_123');
      expect(result).toEqual({ data: 'sample data' });
    });
  });
});
