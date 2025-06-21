import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVehicleCommand } from '../impl/create-vehicle.command';
import { VehicleRepository } from '../../../repositories/vehicle.repository';
import { SimulatorService } from '../../../services/simulator.service';
import { Vehicle } from '@db/api';

@CommandHandler(CreateVehicleCommand)
export class CreateVehicleHandler
  implements ICommandHandler<CreateVehicleCommand>
{
  constructor(
    private readonly repository: VehicleRepository,
    private readonly simulatorService: SimulatorService,
  ) {}

  async execute(command: CreateVehicleCommand): Promise<Vehicle> {
    const { dto } = command;
    const vehicle = await this.repository.create(dto);

    const vin = vehicle.vin;
    const license_plate = vehicle.license_plate;

    this.simulatorService
      .registerVehicle({ vin, license_plate })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(
          `Failed to register vehicle ${vin} in simulator:`,
          message,
        );
      });

    return vehicle;
  }
}
