import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { VehicleRepository } from '../../../repositories/vehicle.repository';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DeleteVehicleCommand } from './delete-vehicle.command';
import { DeleteVehicleResponse } from './delete-vehicle.response';
import { VehicleDeletedEvent } from '@app/common';

@CommandHandler(DeleteVehicleCommand)
export class DeleteVehicleHandler
  implements ICommandHandler<DeleteVehicleCommand>
{
  private readonly logger = new Logger(DeleteVehicleCommand.name);

  constructor(
    private readonly repository: VehicleRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteVehicleCommand): Promise<DeleteVehicleResponse> {
    try {
      const vehicle = await this.repository.delete(command.id);

      this.eventBus.publish(
        new VehicleDeletedEvent(vehicle.id, vehicle.vin, vehicle.license_plate),
      );

      const response = new DeleteVehicleResponse(vehicle);
      return response;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete vehicle with ID ${command.id}: : ${JSON.stringify(error)}`,
      );

      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          `Vehicle with ID ${command.id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }
}
