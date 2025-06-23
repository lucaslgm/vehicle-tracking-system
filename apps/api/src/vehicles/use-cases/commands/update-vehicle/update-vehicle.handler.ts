import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { VehicleRepository } from '../../../repositories/vehicle.repository';
import { UpdateVehicleCommand } from './update-vehicle.command';
import { UpdateVehicleResponse } from './update-vehicle.response';
import { VehicleUpdatedEvent } from '@app/common';

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler
  implements ICommandHandler<UpdateVehicleCommand>
{
  private readonly logger = new Logger(UpdateVehicleHandler.name);

  constructor(
    private readonly repository: VehicleRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateVehicleCommand): Promise<UpdateVehicleResponse> {
    const { id, request } = command;
    try {
      const existingVehicle = await this.repository.findById(id);

      this.logger.debug(
        `Updating vehicle with ID ${id}: ${JSON.stringify(existingVehicle)}`,
      );

      if (!existingVehicle) {
        throw new HttpException(
          `Vehicle with ID ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const vehicle = await this.repository.update(id, request);

      this.eventBus.publish(
        new VehicleUpdatedEvent(
          existingVehicle?.vin,
          vehicle.vin,
          vehicle.license_plate,
        ),
      );

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
