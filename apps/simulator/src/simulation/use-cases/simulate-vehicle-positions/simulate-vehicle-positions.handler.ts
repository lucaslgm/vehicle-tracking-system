import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { SimulateVehiclePositionsCommand } from './simulate-vehicle-positions.command';
import {
  GetAllVehiclesQuery,
  GetAllVehiclesResponse,
} from 'apps/simulator/src/vehicles/use-cases/queries';
import {
  RegisterVehiclePositionCommand,
  RegisterVehiclePositionRequest,
} from 'apps/simulator/src/vehicles/use-cases/commands';
import { PositionEventPatterns, PositionUpdatedEvent } from '@app/common';

@Injectable()
@CommandHandler(SimulateVehiclePositionsCommand)
export class SimulateVehiclePositionsHandler
  implements ICommandHandler<SimulateVehiclePositionsCommand>, OnModuleDestroy
{
  private readonly logger = new Logger(SimulateVehiclePositionsHandler.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Fetching all vehicles to start simulation...');

    const response: GetAllVehiclesResponse = await this.queryBus.execute(
      new GetAllVehiclesQuery(),
    );

    this.logger.log(`Simulating positions for ${response.total} vehicles.`);

    for (const vehicle of response.vehicles) {
      const { latitude, longitude } = this.generateFakeCoordinates();

      const request = new RegisterVehiclePositionRequest(
        vehicle.id,
        latitude,
        longitude,
      );

      await this.commandBus.execute(
        new RegisterVehiclePositionCommand(request),
      );

      this.logger.log(`Emitting position_update event for ${vehicle.vin}`);
      const message = new PositionUpdatedEvent(
        vehicle.vin,
        latitude,
        longitude,
      );
      this.client.emit(PositionEventPatterns.POSITION_UPDATE, message);
    }
  }

  private generateFakeCoordinates(): { latitude: number; longitude: number } {
    const latitude = -23.55052 + (Math.random() - 0.5) * 0.1;
    const longitude = -46.633308 + (Math.random() - 0.5) * 0.1;
    return { latitude, longitude };
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
