import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DatasetsService } from './datasets.service';
import { Dataset } from '../../../models/dataset.model';
import { AccessRequest } from '../../../models/access-request.model';
import { Frequency } from '../../../models/frequency.model';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

describe('DatasetsService', () => {
  let service: DatasetsService;
  let datasetModel: typeof Dataset;
  let accessRequestModel: typeof AccessRequest;
  let frequencyModel: typeof Frequency;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    mockAxios = new MockAdapter(axios);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatasetsService,
        {
          provide: getModelToken(Dataset),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(AccessRequest),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(Frequency),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatasetsService>(DatasetsService);
    datasetModel = module.get<typeof Dataset>(getModelToken(Dataset));
    accessRequestModel = module.get<typeof AccessRequest>(getModelToken(AccessRequest));
    frequencyModel = module.get<typeof Frequency>(getModelToken(Frequency));
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of datasets', async () => {
      const expectedDatasets = [{ id: '1', name: 'dataset1', symbol: 'ds1' }];
      jest.spyOn(datasetModel, 'findAll').mockResolvedValue(expectedDatasets as Dataset[]);

      const result = await service.findAll();
      expect(result).toEqual(expectedDatasets);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(datasetModel, 'findAll').mockRejectedValue(new Error('Service error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findBySymbol', () => {
    it('should return an array of datasets with the given symbol', async () => {
      const symbol = 'ds1';
      const expectedDatasets = [{ id: '1', name: 'dataset1', symbol }];
      jest.spyOn(datasetModel, 'findAll').mockResolvedValue(expectedDatasets as Dataset[]);

      const result = await service.findBySymbol(symbol);
      expect(result).toEqual(expectedDatasets);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      const symbol = 'ds1';
      jest.spyOn(datasetModel, 'findAll').mockRejectedValue(new Error('Service error'));

      await expect(service.findBySymbol(symbol)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getSpecificPricingData', () => {
    it('should return pricing data for the given name', async () => {
      const name = 'bitcoin';
      const expectedData = { data: { id: 'bitcoin', priceUsd: '40000' } };
      mockAxios.onGet(`https://api.coincap.io/v2/assets/${name.toLowerCase()}`).reply(200, expectedData);

      const result = await service.getSpecificPricingData(name);
      expect(result).toEqual(expectedData);
    });

    it('should throw InternalServerErrorException if API call fails', async () => {
      const name = 'bitcoin';
      mockAxios.onGet(`https://api.coincap.io/v2/assets/${name.toLowerCase()}`).reply(500);

      await expect(service.getSpecificPricingData(name)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getDatasetData', () => {
    const name = 'dataset1';
    const frequency = 'daily';
    const userId = 'user1';

    it('should return dataset data if user has access', async () => {
      const dataset = { id: '1', name, symbol: 'ds1' };
      const validFrequency = { id: 'freq1', datasetId: '1', frequency };
      const accessRequest = { id: 'req1', userId, datasetId: '1', frequencyId: 'freq1', status: 'approved' };
      const expectedData = { data: [{ time: 1609459200000, priceUsd: '40000' }] };

      jest.spyOn(datasetModel, 'findOne').mockResolvedValue(dataset as Dataset);
      jest.spyOn(frequencyModel, 'findOne').mockResolvedValue(validFrequency as Frequency);
      jest.spyOn(accessRequestModel, 'findOne').mockResolvedValue(accessRequest as AccessRequest);
      mockAxios.onGet(`https://api.coincap.io/v2/assets/${dataset.symbol.toLowerCase()}/history?interval=${frequency}`).reply(200, expectedData);

      const result = await service.getDatasetData(name, frequency, userId);
      expect(result).toEqual(expectedData);
    });

    it('should throw NotFoundException if dataset is not found', async () => {
      jest.spyOn(datasetModel, 'findOne').mockResolvedValue(null);

      await expect(service.getDatasetData(name, frequency, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if frequency is invalid', async () => {
      const dataset = { id: '1', name, symbol: 'ds1' };
      jest.spyOn(datasetModel, 'findOne').mockResolvedValue(dataset as Dataset);
      jest.spyOn(frequencyModel, 'findOne').mockResolvedValue(null);

      await expect(service.getDatasetData(name, frequency, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user does not have access', async () => {
      const dataset = { id: '1', name, symbol: 'ds1' };
      const validFrequency = { id: 'freq1', datasetId: '1', frequency };
      jest.spyOn(datasetModel, 'findOne').mockResolvedValue(dataset as Dataset);
      jest.spyOn(frequencyModel, 'findOne').mockResolvedValue(validFrequency as Frequency);
      jest.spyOn(accessRequestModel, 'findOne').mockResolvedValue(null);

      await expect(service.getDatasetData(name, frequency, userId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException if API call fails', async () => {
      const dataset = { id: '1', name, symbol: 'ds1' };
      const validFrequency = { id: 'freq1', datasetId: '1', frequency };
      const accessRequest = { id: 'req1', userId, datasetId: '1', frequencyId: 'freq1', status: 'approved' };

      jest.spyOn(datasetModel, 'findOne').mockResolvedValue(dataset as Dataset);
      jest.spyOn(frequencyModel, 'findOne').mockResolvedValue(validFrequency as Frequency);
      jest.spyOn(accessRequestModel, 'findOne').mockResolvedValue(accessRequest as AccessRequest);
      mockAxios.onGet(`https://api.coincap.io/v2/assets/${dataset.symbol.toLowerCase()}/history?interval=${frequency}`).reply(500);

      await expect(service.getDatasetData(name, frequency, userId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
