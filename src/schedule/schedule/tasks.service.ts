import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccessRequestsService } from 'src/modules/access-requests/services/access-requests.service';

@Injectable()
export class TasksService {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.accessRequestsService.checkExpiredAccessRequests();
  }
}
