import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVehicleCommand } from '../impl/update-vehicle.command';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VehicleRepository } from '../../../repositories/vehicle.repository';

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler
  implements ICommandHandler<UpdateVehicleCommand>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(command: UpdateVehicleCommand) {
    const { id, dto } = command;
    try {
      return await this.repository.update(id, dto);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          `Vehicle with ID ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          `Vehicle with license plate "${dto.license_plate}" or VIN "${dto.vin}" already exists.`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }
}
