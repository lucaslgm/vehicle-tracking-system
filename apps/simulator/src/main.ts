import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { RmqQueue } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', '..'));
  app.setGlobalPrefix('simulator');
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vehicle Tracking Simulator')
    .setDescription('API documentation for the Vehicle Tracking Simulator')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('simulator/docs', app, document, {
    customCssUrl: '/swagger-ui.css',
    customJs: ['/swagger-ui-bundle.js', '/swagger-ui-standalone-preset.js'],
    customfavIcon: '/favicon-32x32.png',
  });

  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL');

  if (rabbitmqUrl) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: RmqQueue.VEHICLES_EVENTS,
        queueOptions: {
          durable: true,
          deadLetterExchange: '',
          deadLetterRoutingKey: `${RmqQueue.VEHICLES_EVENTS}_dlq`,
        },
        noAck: false,
      },
    });

    await app.startAllMicroservices();
    Logger.log(
      `Connected to RabbitMQ and listening for messages on queue: ${RmqQueue.VEHICLES_EVENTS}`,
    );
  } else {
    Logger.warn('RABBITMQ_URL not found, skipping microservice connection.');
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  Logger.error('Error during application bootstrap', err);
  process.exit(1);
});
