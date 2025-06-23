import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { VehicleModule } from './vehicles/vehicle.module';
import { CommonModule, GlobalExceptionFilter } from '@app/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    CqrsModule,
    PrismaModule,
    CommonModule,
    VehicleModule,
    SimulationModule,
  ],
  providers: [
    // Registra o ApiTokenGuard globalmente para proteger todos os endpoints.
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiTokenGuard,
    // },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
