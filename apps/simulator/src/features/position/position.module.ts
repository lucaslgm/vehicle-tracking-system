import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VehicleModule } from '../vehicles/vehicle.module';
import { GetHistoryQueryHandler } from './history/queries/get-history.handler';
import { HistoryController } from './history/history.controller';
import { PositionScheduler } from './position.scheduler';
import { PositionService } from './position.service';
import { HistoryService } from './history/history.service';
import { PositionHistoryRepository } from './history/queries/position-history.repository';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

export const QueryHandlers = [GetHistoryQueryHandler];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    VehicleModule,
    ConfigModule,
    // Registra o cliente RabbitMQ que será usado para publicar mensagens.
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE', // Token de injeção para o cliente
        imports: [ConfigModule], // Importa o ConfigModule para dentro do escopo do useFactory
        useFactory: (configService: ConfigService) => {
          // Obtém a URL e verifica se ela existe
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
  controllers: [HistoryController],
  providers: [
    PositionScheduler,
    PositionService,
    HistoryService,
    PositionHistoryRepository,
    ...QueryHandlers,
  ],
})
export class PositionModule {}
