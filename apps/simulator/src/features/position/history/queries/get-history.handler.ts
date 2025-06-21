import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHistoryQuery } from './get-history.query';
import { PositionHistoryRepository } from './position-history.repository';
import { VehicleHistoryResponseDto } from '../dtos/vehicle-history.response.dto';

@QueryHandler(GetHistoryQuery)
export class GetHistoryQueryHandler implements IQueryHandler<GetHistoryQuery> {
  constructor(private readonly repository: PositionHistoryRepository) {}

  async execute(query: GetHistoryQuery): Promise<VehicleHistoryResponseDto> {
    const { license_plate, startDate, endDate } = query;

    const positions = await this.repository.findHistoryByPlate(
      license_plate,
      startDate,
      endDate,
    );

    const response = new VehicleHistoryResponseDto(license_plate, positions);
    return response;
  }
}
