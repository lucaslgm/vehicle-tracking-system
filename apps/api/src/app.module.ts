import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './vehicles/vehicles.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ApiTokenGuard } from './core/auth/api-token.guard';
import { CommonModule, GlobalExceptionFilter } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CqrsModule,
    PrismaModule,
    VehiclesModule,
    CommonModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiTokenGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
