import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVehiclePositionHistoryQuery } from './get-vehicle-position-history.query';
import { GetVehiclePositionHistoryResponse } from './get-vehicle-position-history.response';
import { VehicleRepository } from '../../../repositories';

@QueryHandler(GetVehiclePositionHistoryQuery)
export class GetVehiclePositionHistoryHandler
  implements IQueryHandler<GetVehiclePositionHistoryQuery>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(
    query: GetVehiclePositionHistoryQuery,
  ): Promise<GetVehiclePositionHistoryResponse> {
    const { license_plate, startDate, endDate } = query;

    const positions = await this.repository.findHistoryByPlate(
      license_plate,
      startDate,
      endDate,
    );

    const response = new GetVehiclePositionHistoryResponse({
      vehicleId: license_plate,
      positions,
    });
    return response;
  }
}
