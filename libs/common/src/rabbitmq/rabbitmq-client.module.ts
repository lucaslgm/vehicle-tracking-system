import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqQueue } from './rabbitmq.constants';
import { AmqplibQueueOptions } from '@nestjs/microservices/external/rmq-url.interface';

interface RmqModuleOptions {
  name: string;
  queue: RmqQueue;
  withDLQ?: boolean;
}

@Module({})
export class RabbitMQClientModule {
  static register({
    name,
    queue,
    withDLQ = false,
  }: RmqModuleOptions): DynamicModule {
    return {
      module: RabbitMQClientModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => {
              const rabbitmqUrl = configService.get<string>('RABBITMQ_URL');
              if (!rabbitmqUrl) {
                throw new Error('Missing RABBITMQ_URL environment variable');
              }

              const queueOptions: AmqplibQueueOptions = {
                durable: true,
              };

              if (withDLQ) {
                queueOptions['deadLetterExchange'] = '';
                queueOptions['deadLetterRoutingKey'] = `${queue}_dlq`;
              }

              return {
                transport: Transport.RMQ,
                options: {
                  urls: [rabbitmqUrl],
                  queue: queue,
                  queueOptions: queueOptions,
                },
              };
            },
            inject: [ConfigService],
            imports: [ConfigModule],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
