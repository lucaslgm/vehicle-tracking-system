import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@db/api'; // Adjust the import path based on your project structure

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // This is optional, but good practice to ensure you can connect to the DB
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close().catch((err) => {
        // Optionally log the error
        console.error('Error during app shutdown:', err);
      });
    });
  }
}
