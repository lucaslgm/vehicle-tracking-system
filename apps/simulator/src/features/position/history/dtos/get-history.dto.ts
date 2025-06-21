import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetHistoryDto {
  /**
   * Data de início da consulta. Deve estar no formato ISO 8601.
   * Ex: 2025-06-20T00:00:00.000Z
   */
  @ApiProperty({
    description: 'Data de início da consulta no formato ISO 8601',
    example: '2025-06-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date) // Garante a transformação de string (query param) para objeto Date
  @IsDate() // Valida se o resultado da transformação é uma data válida
  start_date: Date;

  /**
   * Data de fim da consulta. Deve estar no formato ISO 8601.
   * Ex: 2025-06-21T00:00:00.000Z
   */
  @ApiProperty({
    description: 'Data de fim da consulta no formato ISO 8601',
    example: '2025-06-21T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_date: Date;
}
