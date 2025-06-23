import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SimulateVehiclePositionsHandler } from './use-cases/simulate-vehicle-positions/simulate-vehicle-positions.handler';
import { VehiclePositionJob } from './jobs/vehicle-position.job';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const CommandHandlers = [SimulateVehiclePositionsHandler];
export const Jobs = [VehiclePositionJob];

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const rabbitmqUrl = configService.get<string>('RABBITMQ_URL');
          if (!rabbitmqUrl) {
            throw new Error('Missing RABBITMQ_URL environment variable');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitmqUrl],
              queue: 'vehicle-positions',
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [...CommandHandlers, ...Jobs],
})
export class SimulationModule {}
