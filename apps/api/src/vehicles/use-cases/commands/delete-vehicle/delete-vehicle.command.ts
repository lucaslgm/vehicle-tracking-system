import { Command } from '@nestjs/cqrs';
import { IsUUID } from 'class-validator';
import { DeleteVehicleResponse } from './delete-vehicle.response';

export class DeleteVehicleCommand extends Command<DeleteVehicleResponse> {
  @IsUUID()
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
