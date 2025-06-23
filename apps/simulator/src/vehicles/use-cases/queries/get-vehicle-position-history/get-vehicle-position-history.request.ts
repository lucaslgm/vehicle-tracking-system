import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetVehiclePositionHistoryRequest {
  @ApiProperty({
    description: 'Start date for the history query (ISO 8601 format)',
    example: '2025-06-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @ApiProperty({
    description: 'End date for the history query (ISO 8601 format)',
    example: '2025-06-21T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_date: Date;
}
