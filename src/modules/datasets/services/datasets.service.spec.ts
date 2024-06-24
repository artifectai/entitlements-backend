// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/sequelize';
// import { DatasetsService } from './datasets.service';
// import { Dataset } from '../../../models/dataset.model';
// import { AccessRequest } from '../../../models/access-request.model';
// import axios from 'axios';
// import { UnauthorizedException } from '@nestjs/common';

// class MockDataset {
//   static findAll = jest.fn();
//   static findOne = jest.fn();
// }

// class MockAccessRequest {
//   static findOne = jest.fn();
// }

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe('DatasetsService', () => {
//   let service: DatasetsService;
//   let datasetModel: typeof Dataset;
//   let accessRequestModel: typeof AccessRequest;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         DatasetsService,
//         {
//           provide: getModelToken(Dataset),
//           useValue: MockDataset,
//         },
//         {
//           provide: getModelToken(AccessRequest),
//           useValue: MockAccessRequest,
//         },
//       ],
//     }).compile();

//     service = module.get<DatasetsService>(DatasetsService);
//     datasetModel = module.get<typeof Dataset>(getModelToken(Dataset));
//     accessRequestModel = module.get<typeof AccessRequest>(getModelToken(AccessRequest));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('findAll', () => {
//     it('should return an array of datasets', async () => {
//       const datasets = [{ id: 1, name: 'Bitcoin', symbol: 'BTC', frequency: 'd1', market_cap_usd: 1000000 }];
//       jest.spyOn(datasetModel, 'findAll').mockResolvedValue(datasets as Dataset[]);

//       const result = await service.findAll();
//       expect(result).toEqual(datasets);
//     });
//   });

//   describe('findBySymbol', () => {
//     it('should return an array of datasets with the given symbol', async () => {
//       const datasets = [{ id: 1, name: 'Bitcoin', symbol: 'BTC', frequency: 'd1', market_cap_usd: 1000000 }];
//       jest.spyOn(datasetModel, 'findAll').mockResolvedValue(datasets as Dataset[]);

//       const result = await service.findBySymbol('BTC');
//       expect(result).toEqual(datasets);
//     });
//   });

//   describe('getSpecificPricingData', () => {
//     it('should return pricing data for the given name', async () => {
//       const pricingData = { data: { priceUsd: '10000' } };
//       mockedAxios.get.mockResolvedValue({ data: pricingData });

//       const result = await service.getSpecificPricingData('bitcoin');
//       expect(result).toEqual(pricingData);
//     });
//   });

//   describe('getDatasetData', () => {
//     it('should throw an error if dataset name is invalid', async () => {
//       await expect(service.getDatasetData('invalid', 'd1', 1)).rejects.toThrow('Invalid dataset name');
//     });

//     it('should throw an error if frequency is invalid', async () => {
//       await expect(service.getDatasetData('bitcoin', 'invalid', 1)).rejects.toThrow('Invalid frequency');
//     });

//     it('should throw UnauthorizedException if user does not have access', async () => {
//       jest.spyOn(accessRequestModel, 'findOne').mockResolvedValue(null);
//       await expect(service.getDatasetData('bitcoin', 'd1', 1)).rejects.toThrow(UnauthorizedException);
//     });

//     it('should return dataset data if user has access', async () => {
//       const mockAccessRequest = { id: 1, user_id: 1, dataset_id: 'bitcoin', frequency: 'd1', status: 'approved' };
//       jest.spyOn(accessRequestModel, 'findOne').mockResolvedValue(mockAccessRequest as any);
//       const datasetData = { data: { history: 'sample data' } };
//       mockedAxios.get.mockResolvedValue({ data: datasetData });

//       const result = await service.getDatasetData('bitcoin', 'd1', 1);
//       expect(result).toEqual(datasetData);
//     });
//   });
// });
