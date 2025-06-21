import { Command } from '@nestjs/cqrs';
import { CreateVehicleDto } from '../../../dtos/create-vehicle.dto';
import { Vehicle } from '@db/api';

export class CreateVehicleCommand extends Command<Vehicle> {
  constructor(public readonly dto: CreateVehicleDto) {
    super();
  }
}
