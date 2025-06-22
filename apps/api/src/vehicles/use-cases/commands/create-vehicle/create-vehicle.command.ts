import { Command } from '@nestjs/cqrs';
import { CreateVehicleRequest } from './create-vehicle.request';
import { CreateVehicleResponse } from './create-vehicle.response';

export class CreateVehicleCommand extends Command<CreateVehicleResponse> {
  constructor(public readonly request: CreateVehicleRequest) {
    super();
  }
}
