import { Vehicle } from '@db/api';
import { Command } from '@nestjs/cqrs';
import { IsUUID } from 'class-validator';

export class DeleteVehicleCommand extends Command<Vehicle> {
  @IsUUID()
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
