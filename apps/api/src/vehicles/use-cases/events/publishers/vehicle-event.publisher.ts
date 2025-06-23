import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VehicleDeletedEvent, VehicleUpdatedEvent } from '@app/common';

@Injectable()
@EventsHandler(VehicleDeletedEvent, VehicleUpdatedEvent)
export class VehicleEventsPublisher
  implements IEventHandler<VehicleDeletedEvent | VehicleUpdatedEvent>
{
  private readonly logger = new Logger(VehicleEventsPublisher.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  handle(event: VehicleDeletedEvent | VehicleUpdatedEvent) {
    if (event instanceof VehicleDeletedEvent) {
      this.logger.log(
        `Forwarding VehicleDeletedEvent to RabbitMQ for plate: ${event.license_plate}`,
      );
      this.client.emit(VehicleDeletedEvent.eventName, event);
    } else if (event instanceof VehicleUpdatedEvent) {
      this.logger.log(
        `Forwarding VehicleUpdatedEvent to RabbitMQ for plate: ${event.license_plate}`,
      );
      this.client.emit(VehicleUpdatedEvent.eventPattern, event);
    }
  }
}
