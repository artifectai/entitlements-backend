import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatasetsService } from '../../modules/datasets/services/datasets.service';
import { AccessRequestsService } from '../../modules/access-requests/services/access-requests.service';
import { Frequency } from '../../models/frequency.model';
import { Dataset } from '../../models/dataset.model';
import axios from 'axios';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly datasetsService: DatasetsService,
    private readonly accessRequestsService: AccessRequestsService,
    @InjectModel(Frequency)
    private frequencyModel: typeof Frequency,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredTrialAccess() {
    try {
      await this.accessRequestsService.checkExpiredAccessRequests();
    } catch (error) {
      this.logger.error('Error checking expired trial access', error);
      throw new InternalServerErrorException('Failed to check expired trial access');
    }
  }

  @Cron('0 20 * * *', {
    timeZone: 'UTC',
  })
  async backfillMarketCap() {
    this.logger.log('Backfill job started at:', new Date().toISOString());

    try {
      const frequencies = await this.frequencyModel.findAll({
        include: [{
          model: Dataset,
          attributes: ['name'],
        }],
      });

      for (const frequency of frequencies) {
        await this.updateMarketCapForFrequency(frequency);
      }
    } catch (error) {
      this.logger.error('Error during backfill market cap', error);
      throw new InternalServerErrorException('Failed to backfill market cap');
    }
  }

  public async updateMarketCapForFrequency(frequency: Frequency) {
    try {
      const response = await axios.get(`https://api.coincap.io/v2/assets/${frequency.dataset.name.toLowerCase()}`);
      const marketCapUsd = response.data.data.marketCapUsd;
      frequency.marketCapUsd = marketCapUsd;
      await frequency.save();

      this.logger.log(`Updated market cap for ${frequency.dataset.name} (${frequency.frequency}): $${marketCapUsd}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update market cap for ${frequency.dataset.name} (${frequency.frequency}):`, error.message);
      } else {
        this.logger.error(`Failed to update market cap for ${frequency.dataset.name} (${frequency.frequency}):`, error);
      }
    }
  }
}
