import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVehicleByIdQuery } from './get-vehicle-by-id.query';
import { GetVehicleByIdResponse } from './get-vehicle-by-id.response';
import { VehicleRepository } from '../../../repositories/vehicle.repository';

@QueryHandler(GetVehicleByIdQuery)
export class GetVehicleByIdHandler
  implements IQueryHandler<GetVehicleByIdQuery>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(query: GetVehicleByIdQuery): Promise<GetVehicleByIdResponse> {
    const vehicle = await this.repository.findById(query.id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${query.id}" not found.`);
    }

    const response = new GetVehicleByIdResponse(vehicle);
    return response;
  }
}
