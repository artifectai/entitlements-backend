import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatasetsService } from '../../modules/datasets/services/datasets.service';
import { AccessRequestsService } from '../../modules/access-requests/services/access-requests.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Dataset } from '../../models/dataset.model';

describe('TasksService', () => {
  let service: TasksService;
  let datasetsService: DatasetsService;
  let accessRequestsService: AccessRequestsService;
  let axiosMock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: DatasetsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: AccessRequestsService,
          useValue: {
            checkExpiredAccessRequests: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    datasetsService = module.get<DatasetsService>(DatasetsService);
    accessRequestsService = module.get<AccessRequestsService>(AccessRequestsService);

    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkExpiredTrialAccess', () => {
    it('should call checkExpiredAccessRequests', async () => {
      await service.checkExpiredTrialAccess();
      expect(accessRequestsService.checkExpiredAccessRequests).toHaveBeenCalled();
    });
  });

  describe('backfillMarketCap', () => {
    it('should update market cap for all datasets', async () => {
      const datasets: Partial<Dataset>[] = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC', frequency: 'h1', market_cap_usd: undefined, save: jest.fn() },
        { id: 2, name: 'Ethereum', symbol: 'ETH', frequency: 'h1', market_cap_usd: undefined, save: jest.fn() },
      ];

      jest.spyOn(datasetsService, 'findAll').mockResolvedValue(datasets as Dataset[]);

      axiosMock
        .onGet('https://api.coincap.io/v2/assets/bitcoin')
        .reply(200, { data: { marketCapUsd: 1000000000000 } });
      axiosMock
        .onGet('https://api.coincap.io/v2/assets/ethereum')
        .reply(200, { data: { marketCapUsd: 500000000000 } });

      await service.backfillMarketCap();

      expect(datasetsService.findAll).toHaveBeenCalled();

      expect(datasets[0].market_cap_usd).toBe(1000000000000);
      expect(datasets[0].save).toHaveBeenCalled();
      expect(datasets[1].market_cap_usd).toBe(500000000000);
      expect(datasets[1].save).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const datasets: Partial<Dataset>[] = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC', frequency: 'h1', market_cap_usd: undefined, save: jest.fn() },
      ];

      jest.spyOn(datasetsService, 'findAll').mockResolvedValue(datasets as Dataset[]);

      axiosMock.onGet('https://api.coincap.io/v2/assets/bitcoin').reply(500);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.backfillMarketCap();

      expect(datasetsService.findAll).toHaveBeenCalled();
      expect(datasets[0].market_cap_usd).toBeUndefined();
      expect(datasets[0].save).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
