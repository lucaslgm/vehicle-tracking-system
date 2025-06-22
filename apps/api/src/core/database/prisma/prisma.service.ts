import {
  Injectable,
  OnModuleInit,
  Logger,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@db/api';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close().catch((err: unknown) => {
        this.logger.error('Error during app shutdown:', err);
      });
    });
  }
}
