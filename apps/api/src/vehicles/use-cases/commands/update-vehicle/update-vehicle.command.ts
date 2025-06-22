import { Command } from '@nestjs/cqrs';
import { UpdateVehicleResponse } from './update-vehicle.response';
import { UpdateVehicleRequest } from './update-vehicle.request';

export class UpdateVehicleCommand extends Command<UpdateVehicleResponse> {
  constructor(
    public readonly id: string,
    public readonly request: UpdateVehicleRequest,
  ) {
    super();
  }
}
