// Serviço que usa o QueryBus para buscar o histórico.

import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetHistoryQuery } from './queries/get-history.query';
import { VehicleHistoryResponseDto } from './dtos/vehicle-history.response.dto';

@Injectable()
export class HistoryService {
  constructor(private readonly queryBus: QueryBus) {}

  async findHistory(
    license_plate: string,
    startDate: Date,
    endDate: Date,
  ): Promise<VehicleHistoryResponseDto> {
    return this.queryBus.execute(
      new GetHistoryQuery(license_plate, startDate, endDate),
    );
  }
}
