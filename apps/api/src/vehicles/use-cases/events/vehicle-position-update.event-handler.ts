import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { VehicleRepository } from '../../repositories/vehicle.repository';

class PositionUpdatePayload {
  vin: string;
  latitude: number;
  longitude: number;
}

@Controller()
export class PositionUpdateEventHandler {
  private readonly logger: Logger = new Logger(PositionUpdateEventHandler.name);
  constructor(private readonly repository: VehicleRepository) {}

  @EventPattern('position_update')
  async handlePositionUpdate(
    @Payload() data: PositionUpdatePayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Received position update for VIN: ${data.vin}`);

      const vehicle = await this.repository.findByVin(data.vin);

      if (vehicle) {
        await this.repository.update(vehicle.id, {
          latitude: data.latitude,
          longitude: data.longitude,
        });

        this.logger.log(`Vehicle ${data.vin} position updated.`);
      } else {
        this.logger.warn(
          `Vehicle with VIN ${data.vin} not found in gateway DB. Ignoring message.`,
        );
      }
    } catch (error) {
      this.logger.error('Error processing position update message:', error);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false);
    }
  }
}
