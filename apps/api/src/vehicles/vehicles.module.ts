import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../core/database/prisma/prisma.module';

import { VehiclesController } from './vehicles.controller';
import { VehicleRepository } from './repositories/vehicle.repository';
import { SimulatorService } from './services/simulator.service';

// Import command handlers directly
import { PositionUpdateHandler } from './use-cases/events/position-update.handler';
import { CreateVehicleHandler } from './use-cases/commands/handlers/create-vehicle.handler';
import { UpdateVehicleHandler } from './use-cases/commands/handlers/update-vehicle.handler';
import { DeleteVehicleHandler } from './use-cases/commands/handlers/delete-vehicle.handler';
import { GetAllVehiclesHandler } from './use-cases/queries/get-all-vehicles/get-all-vehicles.handler';
import { GetVehicleByIdHandler } from './use-cases/queries/get-vehicle-by-id/get-vehicle-by-id.handler';
import { GetVehicleHistoryHandler } from './use-cases/queries/get-vehicle-history/get-vehicle-history.handler';
// Adicione aqui outros handlers que você criar...

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
  controllers: [VehiclesController, PositionUpdateHandler],
  providers: [
    VehicleRepository,
    SimulatorService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class VehiclesModule {}
