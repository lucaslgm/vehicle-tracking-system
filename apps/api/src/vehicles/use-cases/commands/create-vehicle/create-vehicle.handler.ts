import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VehicleRepository } from '../../../repositories/vehicle.repository';
import { SimulatorService } from '../../../services/simulator.service';
import { CreateVehicleCommand } from './create-vehicle.command';
import { CreateVehicleResponse } from './create-vehicle.response';
import { ConflictException, Logger } from '@nestjs/common';

@CommandHandler(CreateVehicleCommand)
export class CreateVehicleHandler
  implements ICommandHandler<CreateVehicleCommand>
{
  private readonly logger = new Logger(CreateVehicleHandler.name);

  constructor(
    private readonly repository: VehicleRepository,
    private readonly simulatorService: SimulatorService,
  ) {}

  async execute(command: CreateVehicleCommand): Promise<CreateVehicleResponse> {
    const { request } = command;
    const vehicle = await this.repository.create(request);
    const response = new CreateVehicleResponse(vehicle);

    this.simulatorService
      .registerVehicle({
        vin: vehicle.vin,
        license_plate: vehicle.license_plate,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `Failed to register vehicle in simulator: ${JSON.stringify(error)}`,
        );

        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            `Vehicle with license plate "${request.license_plate}" or VIN "${request.vin}" already exists.`,
          );
        }
        throw error;
      });

    return response;
  }
}
