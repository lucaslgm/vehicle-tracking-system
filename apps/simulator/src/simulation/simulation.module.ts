import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SimulateVehiclePositionsHandler } from './use-cases/simulate-vehicle-positions/simulate-vehicle-positions.handler';
import { VehiclePositionJob } from './jobs/vehicle-position.job';
import { RabbitMQClientModule, RmqQueue } from '@app/common';

export const CommandHandlers = [SimulateVehiclePositionsHandler];
export const Jobs = [VehiclePositionJob];

@Module({
  imports: [
    CqrsModule,
    RabbitMQClientModule.register({
      name: 'RABBITMQ_SERVICE',
      queue: RmqQueue.VEHICLE_POSITIONS,
    }),
  ],
  providers: [...CommandHandlers, ...Jobs],
})
export class SimulationModule {}
