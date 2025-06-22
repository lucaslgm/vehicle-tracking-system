import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty } from 'class-validator';

export class GetVehicleHistoryRequest {
  @ApiProperty({
    description: 'Start date for the history query (ISO 8601 format)',
    example: '2025-06-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  start_date: string;

  @ApiProperty({
    description: 'End date for the history query (ISO 8601 format)',
    example: '2025-06-21T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  end_date: string;
}
