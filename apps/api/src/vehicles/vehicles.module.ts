import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../core/database';
import { VehiclesController } from './vehicles.controller';
import { VehicleRepository } from './repositories';
import { SimulatorService } from './services';
import { RabbitMQClientModule, RmqQueue } from '@app/common';
import {
  OnVehicleEventsController,
  VehicleEventsPublisher,
} from './use-cases/events/';
import {
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
  GetVehicleHistoryHandler,
} from './use-cases/queries';
import {
  CreateVehicleHandler,
  UpdateVehicleHandler,
  DeleteVehicleHandler,
} from './use-cases/commands';

export const CommandHandlers = [
  CreateVehicleHandler,
  UpdateVehicleHandler,
  DeleteVehicleHandler,
];
export const QueryHandlers = [
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
  GetVehicleHistoryHandler,
];

export const EventPublishers = [VehicleEventsPublisher];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    HttpModule,
    RabbitMQClientModule.register({
      name: 'RABBITMQ_SERVICE',
      queue: RmqQueue.VEHICLES_EVENTS,
      withDLQ: true,
    }),
  ],
  controllers: [VehiclesController, OnVehicleEventsController],
  providers: [
    VehicleRepository,
    SimulatorService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventPublishers,
  ],
})
export class VehiclesModule {}
