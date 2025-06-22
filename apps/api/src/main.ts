import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', '..'));
  app.setGlobalPrefix('api', { exclude: ['/api/docs'] });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vehicle Tracking API')
    .setDescription('API for managing and tracking a fleet of vehicles.')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local server')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-token', in: 'header' },
      'ApiToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      useGlobalPrefix: true,
      validatorUrl: null,
    },
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
        queue: 'vehicle-positions',
        queueOptions: {
          durable: true,
        },
      },
    });

    await app.startAllMicroservices();
    Logger.log(
      'Connected to RabbitMQ and listening for messages on queue: vehicle-positions',
    );
  } else {
    Logger.warn('RABBITMQ_URL not found, skipping microservice connection.');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  Logger.error('Error during application bootstrap', err);
  process.exit(1);
});
