import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../core/database';
import { VehiclesController } from './vehicles.controller';
import { VehicleRepository } from './repositories';
import { SimulatorService } from './services';
import { PositionUpdateEventHandler } from './use-cases/events/';
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

@Module({
  imports: [CqrsModule, PrismaModule, HttpModule],
  controllers: [VehiclesController, PositionUpdateEventHandler],
  providers: [
    VehicleRepository,
    SimulatorService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class VehiclesModule {}
