import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Module({
  providers: [GlobalExceptionFilter],
  exports: [GlobalExceptionFilter],
})
export class CommonModule {}
