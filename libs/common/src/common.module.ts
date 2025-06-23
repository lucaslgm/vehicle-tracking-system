import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ApiTokenGuard } from './auth/api-token.guard';

@Module({
  imports: [ConfigModule],
  providers: [ApiTokenGuard, GlobalExceptionFilter],
  exports: [ApiTokenGuard, GlobalExceptionFilter, ConfigModule],
})
export class CommonModule {}
