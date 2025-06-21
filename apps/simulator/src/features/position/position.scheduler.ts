import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PositionService } from './position.service';

@Injectable()
export class PositionScheduler {
  constructor(private readonly positionService: PositionService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Running position simulation job...');
    this.positionService.simulateAndPublishPositions();
  }
}
