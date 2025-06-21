import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVehicleCommand } from '../impl/delete-vehicle.command';
import { VehicleRepository } from '../../../repositories/vehicle.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(DeleteVehicleCommand)
export class DeleteVehicleHandler
  implements ICommandHandler<DeleteVehicleCommand>
{
  constructor(private readonly repository: VehicleRepository) {}

  async execute(command: DeleteVehicleCommand) {
    try {
      return await this.repository.delete(command.id);
    } catch (error: unknown) {
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
