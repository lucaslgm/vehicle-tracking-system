import { Command } from '@nestjs/cqrs';
import { RegisterVehiclePositionRequest } from './register-vehicle-position.request';
import { RegisterVehiclePositionRequestResponse } from './register-vehicle-position.response';

export class RegisterVehiclePositionCommand extends Command<RegisterVehiclePositionRequestResponse> {
  constructor(public readonly request: RegisterVehiclePositionRequest) {
    super();
  }
}
