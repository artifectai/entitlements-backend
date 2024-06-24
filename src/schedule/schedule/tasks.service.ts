import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatasetsService } from '../../modules/datasets/services/datasets.service';
import { AccessRequestsService } from '../../modules/access-requests/services/access-requests.service';
import axios from 'axios'

@Injectable()
export class TasksService {
  constructor(
    private readonly datasetsService: DatasetsService,
    private readonly accessRequestsService: AccessRequestsService,
  ) {}


  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredTrialAccess() {
    await this.accessRequestsService.checkExpiredAccessRequests();
  }
  
  @Cron('0 20 * * *', {
    timeZone: 'UTC',
  })
  async backfillMarketCap() {
    console.log('Backfill job started at:', new Date().toISOString());

    const datasets = await this.datasetsService.findAll();

    for (const dataset of datasets) {
      try {
        const response = await axios.get(`https://api.coincap.io/v2/assets/${dataset.name.toLowerCase()}`);
        const marketCapUsd = response.data.data.marketCapUsd;
        dataset.market_cap_usd = marketCapUsd;
        await dataset.save();
        
        console.log(`Updated market cap for ${dataset.name}: $${marketCapUsd}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to update market cap for ${dataset.name}:`, error.message);
        } else {
          console.error(`Failed to update market cap for ${dataset.name}:`, error);
        }      }
    }
  }
}
