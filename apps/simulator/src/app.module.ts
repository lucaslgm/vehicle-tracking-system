import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { VehicleModule } from './features/vehicles/vehicle.module';
import { PositionModule } from './features/position/position.module';
import { CommonModule, GlobalExceptionFilter } from '@app/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(), // Habilita o agendador de tarefas
    CqrsModule, // Habilita o módulo CQRS
    PrismaModule,
    CommonModule,
    VehicleModule,
    PositionModule,
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
