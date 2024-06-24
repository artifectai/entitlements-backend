import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatasetsService } from '../../modules/datasets/services/datasets.service';
import { AccessRequestsService } from '../../modules/access-requests/services/access-requests.service';
import { getModelToken } from '@nestjs/sequelize';
import { Frequency } from '../../models/frequency.model';
import { Dataset } from '../../models/dataset.model';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InternalServerErrorException, Logger } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let accessRequestsService: AccessRequestsService;
  let frequencyModel: typeof Frequency;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    mockAxios = new MockAdapter(axios);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: DatasetsService,
          useValue: {}, // Mock DatasetsService as an empty object
        },
        {
          provide: AccessRequestsService,
          useValue: {
            checkExpiredAccessRequests: jest.fn(),
          },
        },
        {
          provide: getModelToken(Frequency),
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    accessRequestsService = module.get<AccessRequestsService>(AccessRequestsService);
    frequencyModel = module.get<typeof Frequency>(getModelToken(Frequency));
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkExpiredTrialAccess', () => {
    it('should call checkExpiredAccessRequests', async () => {
      jest.spyOn(accessRequestsService, 'checkExpiredAccessRequests').mockResolvedValue(undefined);

      await service.checkExpiredTrialAccess();

      expect(accessRequestsService.checkExpiredAccessRequests).toHaveBeenCalled();
    });

    it('should log and throw an error if checkExpiredAccessRequests fails', async () => {
      const error = new Error('Test error');
      jest.spyOn(accessRequestsService, 'checkExpiredAccessRequests').mockRejectedValue(error);
      jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

      await expect(service.checkExpiredTrialAccess()).rejects.toThrow(InternalServerErrorException);
      expect(Logger.prototype.error).toHaveBeenCalledWith('Error checking expired trial access', error);
    });
  });

  describe('backfillMarketCap', () => {
    it('should log and call updateMarketCapForFrequency for each frequency', async () => {
      const frequencies = [
        {
          dataset: { name: 'bitcoin' },
          frequency: 'daily',
          marketCapUsd: '1000000',
          save: jest.fn(),
        },
      ];
      jest.spyOn(frequencyModel, 'findAll').mockResolvedValue(frequencies as any);
      jest.spyOn(service, 'updateMarketCapForFrequency').mockResolvedValue(undefined);
      jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});

      await service.backfillMarketCap();

      expect(Logger.prototype.log).toHaveBeenCalledWith('Backfill job started at:', expect.any(String));
      expect(frequencyModel.findAll).toHaveBeenCalled();
      for (const frequency of frequencies) {
        expect(service.updateMarketCapForFrequency).toHaveBeenCalledWith(frequency);
      }
    });

    it('should log and throw an error if findAll fails', async () => {
      const error = new Error('Test error');
      jest.spyOn(frequencyModel, 'findAll').mockRejectedValue(error);
      jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

      await expect(service.backfillMarketCap()).rejects.toThrow(InternalServerErrorException);
      expect(Logger.prototype.error).toHaveBeenCalledWith('Error during backfill market cap', error);
    });
  });

  describe('updateMarketCapForFrequency', () => {
    it('should update the market cap for a frequency and save it', async () => {
      const frequency = {
        dataset: { name: 'bitcoin' },
        frequency: 'daily',
        marketCapUsd: '1000000',
        save: jest.fn().mockResolvedValue(undefined),
      };
      const responseData = { data: { marketCapUsd: '2000000' } };
      mockAxios.onGet('https://api.coincap.io/v2/assets/bitcoin').reply(200, responseData);
      jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});

      await service.updateMarketCapForFrequency(frequency as any);

      expect(frequency.marketCapUsd).toBe('2000000');
      expect(frequency.save).toHaveBeenCalled();
      expect(Logger.prototype.log).toHaveBeenCalledWith(`Updated market cap for bitcoin (daily): $2000000`);
    });

    it('should log an error if the API call fails', async () => {
      const frequency = {
        dataset: { name: 'bitcoin' },
        frequency: 'daily',
        marketCapUsd: '1000000',
        save: jest.fn(),
      };
      mockAxios.onGet('https://api.coincap.io/v2/assets/bitcoin').reply(500);
      jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

      await service.updateMarketCapForFrequency(frequency as any);

      expect(Logger.prototype.error).toHaveBeenCalledWith(`Failed to update market cap for bitcoin (daily):`, expect.any(String));
    });
  });
});
