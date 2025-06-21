// Este não é um handler CQRS padrão, mas um listener de microserviço.
// Vamos colocá-lo aqui por organização, mas ele será chamado pelo Controller.

import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { VehicleRepository } from '../../repositories/vehicle.repository';

class PositionUpdatePayload {
  vin: string;
  latitude: number;
  longitude: number;
}

@Controller()
export class PositionUpdateHandler {
  constructor(private readonly repository: VehicleRepository) {}

  @EventPattern('position_update')
  async handlePositionUpdate(
    @Payload() data: PositionUpdatePayload,
    @Ctx() context: RmqContext,
  ) {
    // const channel = context.getChannelRef();
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(`Received position update for VIN: ${data.vin}`);

      // Encontrar o veículo pelo VIN
      const vehicle = await this.repository.findByVin(data.vin);

      if (vehicle) {
        await this.repository.update(vehicle.id, {
          latitude: data.latitude,
          longitude: data.longitude,
        });
        console.log(`Vehicle ${data.vin} position updated.`);
      } else {
        console.warn(
          `Vehicle with VIN ${data.vin} not found in gateway DB. Ignoring message.`,
        );
      }
    } catch (error) {
      console.error('Error processing position update message:', error);
      // Em caso de erro, rejeita a mensagem, mas não a recoloca na fila
      // para evitar loops de processamento infinitos.
      channel.nack(originalMsg, false, false);
    }
  }
}
