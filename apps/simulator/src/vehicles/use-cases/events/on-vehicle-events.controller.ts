import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { VehicleRepository } from '../../repositories';
import {
  VehicleDeletedEvent,
  VehicleUpdatedEvent,
  VehicleEventPatterns,
} from '@app/common';

@Controller()
export class OnVehicleEventsController {
  private readonly logger = new Logger(OnVehicleEventsController.name);

  constructor(private readonly repository: VehicleRepository) {}

  @EventPattern(VehicleEventPatterns.VEHICLE_DELETED)
  async handleVehicleDeleted(
    @Payload() event: VehicleDeletedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const originalMsg = context.getMessage();
    const { vin, license_plate } = event;

    this.logger.log(
      `Handling vehicle.deleted event for plate: ${license_plate}`,
    );

    try {
      await this.repository.deleteByVinOrPlate(vin, license_plate);
      this.logger.log(
        `Successfully deleted vehicle ${license_plate} from simulator.`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.ack(originalMsg);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete vehicle ${license_plate} from simulator.`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false);
    }
  }

  @EventPattern(VehicleEventPatterns.VEHICLE_UPDATED)
  async handleVehicleUpdated(
    @Payload() event: VehicleUpdatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const originalMsg = context.getMessage();
    const { oldVin, vin, license_plate } = event;

    this.logger.log(
      `Handling vehicle.updated event for plate: ${license_plate}.`,
    );

    try {
      await this.repository.updateByVin(oldVin, vin, license_plate);

      this.logger.log(
        `Successfully updated vehicle ${license_plate} in simulator.`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.ack(originalMsg);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to update vehicle ${license_plate} in simulator.`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false);
    }
  }
}
