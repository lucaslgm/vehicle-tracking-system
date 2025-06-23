import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { VehicleController } from './vehicle.controller';
import { VehicleRepository } from './repositories';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {
  RegisterVehicleHandler,
  RegisterVehiclePositionHandler,
} from './use-cases/commands';
import {
  GetAllVehiclesHandler,
  GetVehiclePositionHistoryHandler,
} from './use-cases/queries';
import { OnVehicleEventsController } from './use-cases/events';

export const CommandHandlers = [
  RegisterVehicleHandler,
  RegisterVehiclePositionHandler,
];
export const QueryHandlers = [
  GetAllVehiclesHandler,
  GetVehiclePositionHistoryHandler,
];

export const EventControllers = [OnVehicleEventsController];

@Module({
  imports: [CqrsModule, PrismaModule, ConfigModule],
  controllers: [VehicleController, ...EventControllers],
  providers: [...CommandHandlers, ...QueryHandlers, VehicleRepository],
  exports: [VehicleRepository],
})
export class VehicleModule {}
