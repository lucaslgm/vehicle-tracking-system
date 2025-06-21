import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterVehicleCommand } from './register-vehicle.command';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VehicleRepository } from '../domain/vehicle.repository';

@CommandHandler(RegisterVehicleCommand)
export class RegisterVehicleHandler
  implements ICommandHandler<RegisterVehicleCommand>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(command: RegisterVehicleCommand): Promise<any> {
    const { vin, license_plate } = command;

    const existingVehicle = await this.repository.findByVinOrPlate(
      vin,
      license_plate,
    );
    if (existingVehicle) {
      throw new HttpException(
        'Vehicle with this VIN or license plate already exists',
        HttpStatus.CONFLICT,
      );
    }

    console.log(`Registering vehicle in simulator: ${vin}`);
    return this.repository.create({ vin, license_plate });
  }
}
