import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllVehiclesQuery } from './get-all-vehicles.query';
import { GetAllVehiclesResponse } from './get-all-vehicles.response';
import { VehicleRepository } from 'apps/api/src/vehicles/repositories/vehicle.repository';

@QueryHandler(GetAllVehiclesQuery)
export class GetAllVehiclesHandler
  implements IQueryHandler<GetAllVehiclesQuery>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(): Promise<GetAllVehiclesResponse> {
    const vehicles = await this.repository.findAll();
    const response = new GetAllVehiclesResponse(vehicles);
    return response;
  }
}
