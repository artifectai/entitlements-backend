import { Test, TestingModule } from '@nestjs/testing';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from '../services/datasets.service';
import { Dataset } from '../../../models/dataset.model';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('DatasetsController', () => {
  let controller: DatasetsController;
  let datasetsService: DatasetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetsController],
      providers: [
        {
          provide: DatasetsService,
          useValue: {
            findAll: jest.fn(),
            findBySymbol: jest.fn(),
            getSpecificPricingData: jest.fn(),
            getDatasetData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DatasetsController>(DatasetsController);
    datasetsService = module.get<DatasetsService>(DatasetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of datasets', async () => {
      const expectedDatasets = [{ id: '1', name: 'dataset1', symbol: 'ds1' }];
      jest.spyOn(datasetsService, 'findAll').mockResolvedValue(expectedDatasets as Dataset[]);

      const result = await controller.findAll();
      expect(result).toEqual(expectedDatasets);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(datasetsService, 'findAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findBySymbol', () => {
    const symbol = 'ds1';

    it('should return an array of datasets with the given symbol', async () => {
      const expectedDatasets = [{ id: '1', name: 'dataset1', symbol }];
      jest.spyOn(datasetsService, 'findBySymbol').mockResolvedValue(expectedDatasets as Dataset[]);

      const result = await controller.findBySymbol(symbol);
      expect(result).toEqual(expectedDatasets);
    });

    it('should throw BadRequestException if symbol is not provided', async () => {
      await expect(controller.findBySymbol('')).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(datasetsService, 'findBySymbol').mockRejectedValue(new Error('Service error'));

      await expect(controller.findBySymbol(symbol)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getPricingData', () => {
    const name = 'bitcoin';

    it('should return pricing data for the given name', async () => {
      const expectedData = { data: { id: 'bitcoin', priceUsd: '40000' } };
      jest.spyOn(datasetsService, 'getSpecificPricingData').mockResolvedValue(expectedData);

      const result = await controller.getPricingData(name);
      expect(result).toEqual(expectedData);
    });

    it('should throw BadRequestException if name is not provided', async () => {
      await expect(controller.getPricingData('')).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(datasetsService, 'getSpecificPricingData').mockRejectedValue(new Error('Service error'));

      await expect(controller.getPricingData(name)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getDataset', () => {
    const name = 'dataset1';
    const frequency = 'daily';
    const userId = 'user1';

    it('should return dataset data if user has access', async () => {
      const expectedData = { data: [{ time: 1609459200000, priceUsd: '40000' }] };
      jest.spyOn(datasetsService, 'getDatasetData').mockResolvedValue(expectedData);

      const result = await controller.getDataset(name, frequency, userId);
      expect(result).toEqual(expectedData);
    });

    it('should throw BadRequestException if name, frequency, or userId is not provided', async () => {
      await expect(controller.getDataset('', frequency, userId)).rejects.toThrow(BadRequestException);
      await expect(controller.getDataset(name, '', userId)).rejects.toThrow(BadRequestException);
      await expect(controller.getDataset(name, frequency, '')).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if service throws an error', async () => {
      jest.spyOn(datasetsService, 'getDatasetData').mockRejectedValue(new Error('Service error'));

      await expect(controller.getDataset(name, frequency, userId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
