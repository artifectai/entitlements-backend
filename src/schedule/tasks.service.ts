import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatasetsService } from '../modules/datasets/services/datasets.service';
import { AccessRequestsService } from '../modules/access-requests/services/access-requests.service';
import { Frequency } from '../models/frequency.model';
import { Dataset } from '../models/dataset.model';
import axios from 'axios'

@Injectable()
export class TasksService {
  constructor(
    private readonly datasetsService: DatasetsService,
    private readonly accessRequestsService: AccessRequestsService,
    @InjectModel(Frequency)
    private frequencyModel: typeof Frequency,
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

    const frequencies = await this.frequencyModel.findAll({
      include: [{
        model: Dataset,
        attributes: ['name'],
      }],
    });

    for (const frequency of frequencies) {
      try {
        const response = await axios.get(`https://api.coincap.io/v2/assets/${frequency.dataset.name.toLowerCase()}`);
        const marketCapUsd = response.data.data.marketCapUsd;
        frequency.marketCapUsd = marketCapUsd;
        await frequency.save();
        
        console.log(`Updated market cap for ${frequency.dataset.name} (${frequency.frequency}): $${marketCapUsd}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to update market cap for ${frequency.dataset.name} (${frequency.frequency}):`, error.message);
        } else {
          console.error(`Failed to update market cap for ${frequency.dataset.name} (${frequency.frequency}):`, error);
        }
      }
    }
  }
}
