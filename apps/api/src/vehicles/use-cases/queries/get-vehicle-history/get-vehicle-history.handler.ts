import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVehicleHistoryQuery } from './get-vehicle-history.query';
import { GetVehicleHistoryResponse } from './get-vehicle-history.response';
import { SimulatorService } from '../../../services/simulator.service';

@QueryHandler(GetVehicleHistoryQuery)
export class GetVehicleHistoryHandler
  implements IQueryHandler<GetVehicleHistoryQuery>
{
  constructor(private readonly simulatorService: SimulatorService) {}

  async execute(
    query: GetVehicleHistoryQuery,
  ): Promise<GetVehicleHistoryResponse> {
    const { licensePlate, startDate, endDate } = query;

    const vehicleHistory = await this.simulatorService.getVehicleHistory(
      licensePlate,
      startDate,
      endDate,
    );

    const response = new GetVehicleHistoryResponse(vehicleHistory);
    return response;
  }
}
