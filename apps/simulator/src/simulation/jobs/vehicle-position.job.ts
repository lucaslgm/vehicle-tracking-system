import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { SimulateVehiclePositionsCommand } from '../use-cases';

@Injectable()
export class VehiclePositionJob {
  private readonly logger = new Logger(VehiclePositionJob.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.log('Dispatching command to simulate vehicle positions...');
    try {
      await this.commandBus.execute(new SimulateVehiclePositionsCommand());
    } catch (error) {
      this.logger.error('Error dispatching simulation command:', error);
    }
  }
}
