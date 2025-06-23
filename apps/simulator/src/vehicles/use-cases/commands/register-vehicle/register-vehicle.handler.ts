import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterVehicleCommand, RegisterVehicleResponse } from '.';
import { ConflictException, Logger } from '@nestjs/common';
import { VehicleRepository } from '../../../repositories';

@CommandHandler(RegisterVehicleCommand)
export class RegisterVehicleHandler
  implements ICommandHandler<RegisterVehicleCommand>
{
  private readonly logger = new Logger(RegisterVehicleHandler.name);

  constructor(private readonly repository: VehicleRepository) {}

  async execute(
    command: RegisterVehicleCommand,
  ): Promise<RegisterVehicleResponse> {
    const { vin, license_plate } = command;

    const existingVehicle = await this.repository.findByVinOrPlate(
      vin,
      license_plate,
    );
    if (existingVehicle) {
      throw new ConflictException(
        'Vehicle with this VIN or license plate already exists',
      );
    }

    this.logger.log(`Registering vehicle in simulator: ${vin}`);
    const vehicle = await this.repository.registerVehicle(license_plate, vin);
    const response = new RegisterVehicleResponse(vehicle);
    return response;
  }
}
