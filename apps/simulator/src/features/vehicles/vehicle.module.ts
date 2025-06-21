// Módulo responsável pela lógica de veículos.

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { VehicleController } from './vehicle.controller';
import { RegisterVehicleHandler } from './commands/register-vehicle.handler';
import { VehicleRepository } from './domain/vehicle.repository';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

export const CommandHandlers = [RegisterVehicleHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VehicleController],
  providers: [...CommandHandlers, VehicleRepository],
  exports: [VehicleRepository], // Exporta o repositório para ser usado em outros módulos
})
export class VehicleModule {}
