import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { VehicleRepository } from '../../../repositories/vehicle.repository';
import { UpdateVehicleCommand } from './update-vehicle.command';
import { UpdateVehicleResponse } from './update-vehicle.response';

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler
  implements ICommandHandler<UpdateVehicleCommand>
{
  private readonly logger = new Logger(UpdateVehicleHandler.name);

  constructor(private readonly repository: VehicleRepository) {}

  async execute(command: UpdateVehicleCommand): Promise<UpdateVehicleResponse> {
    const { id, request } = command;
    try {
      const vehicle = await this.repository.update(id, request);
      const response = new UpdateVehicleResponse(vehicle);
      return response;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to update vehicle with ID ${id}: ${JSON.stringify(error)}`,
      );
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
          `Vehicle with license plate "${request.license_plate}" or VIN "${request.vin}" already exists.`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }
}
