import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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

  // Conecta-se à fila do RabbitMQ para atuar como um consumidor
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

    // Inicia o consumidor de mensagens
    await app.startAllMicroservices();
    console.log('Microservice listener for RabbitMQ is running');
  } else {
    console.warn(
      'RABBITMQ_URL not found, microservice listener is not running.',
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
