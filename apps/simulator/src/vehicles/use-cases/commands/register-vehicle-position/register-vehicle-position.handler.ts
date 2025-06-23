import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { RegisterVehiclePositionCommand } from './register-vehicle-position.command';
import { VehicleRepository } from '../../../repositories';
import { IVehiclePosition } from '../../../shared/interfaces/vehicle-position.interface';
import { RegisterVehiclePositionRequestResponse } from './register-vehicle-position.response';

@CommandHandler(RegisterVehiclePositionCommand)
export class RegisterVehiclePositionHandler
  implements ICommandHandler<RegisterVehiclePositionCommand, IVehiclePosition>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(
    command: RegisterVehiclePositionCommand,
  ): Promise<RegisterVehiclePositionRequestResponse> {
    const { vehicleId, latitude, longitude } = command.request;

    const position = await this.repository
      .registerPosition(vehicleId, latitude, longitude)
      .catch((error: unknown) => {
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(
            `Vehicle with ID ${vehicleId} not found.`,
          );
        }
        throw error;
      });

    const response = new RegisterVehiclePositionRequestResponse(position);
    return response;
  }
}
