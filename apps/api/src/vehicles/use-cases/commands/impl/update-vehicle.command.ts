import { Vehicle } from '@db/api';
import { Command } from '@nestjs/cqrs';
import { UpdateVehicleDto } from '../../../dtos/update-vehicle.dto';

export class UpdateVehicleCommand extends Command<Vehicle> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateVehicleDto,
  ) {
    super();
  }
}
