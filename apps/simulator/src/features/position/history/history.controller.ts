import { Controller, Get, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { GetHistoryDto } from './dtos/get-history.dto';
import { VehicleHistoryResponseDto } from './dtos/vehicle-history.response.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':license_plate')
  async getHistory(
    @Param('license_plate') license_plate: string,
    @Query() query: GetHistoryDto,
  ): Promise<VehicleHistoryResponseDto> {
    return this.historyService.findHistory(
      license_plate,
      query.start_date,
      query.end_date,
    );
  }
}
