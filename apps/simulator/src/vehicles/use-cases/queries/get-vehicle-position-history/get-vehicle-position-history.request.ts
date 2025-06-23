import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetVehiclePositionHistoryRequest {
  @ApiProperty({
    description: 'Data de início da consulta no formato ISO 8601',
    example: '2025-06-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @ApiProperty({
    description: 'Data de fim da consulta no formato ISO 8601',
    example: '2025-06-21T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_date: Date;
}
