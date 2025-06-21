// Serviço com a lógica principal da simulação, agora usando ClientProxy.

import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VehicleRepository } from '../vehicles/domain/vehicle.repository';
import { PositionHistoryRepository } from './history/queries/position-history.repository';

@Injectable()
export class PositionService implements OnModuleDestroy {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly historyRepo: PositionHistoryRepository,
    // Injeta o cliente RabbitMQ registrado no módulo
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async simulateAndPublishPositions() {
    const vehicles = await this.vehicleRepo.findAll();

    for (const vehicle of vehicles) {
      const { latitude, longitude } = this.generateFakeCoordinates();

      await this.historyRepo.create({
        latitude,
        longitude,
        vehicle: { connect: { id: vehicle.id } },
      });

      const message = { vin: vehicle.vin, latitude, longitude };

      // Usamos client.emit() para publicar a mensagem.
      // O primeiro argumento é o "padrão" ou "tópico" do evento.
      // A api-gateway vai escutar por este mesmo padrão.
      console.log(`Emitting position_update event for ${vehicle.vin}`);
      this.client.emit('position_update', message);
    }
  }

  private generateFakeCoordinates(): { latitude: number; longitude: number } {
    const latitude = -23.55052 + (Math.random() - 0.5) * 0.1;
    const longitude = -46.633308 + (Math.random() - 0.5) * 0.1;
    return { latitude, longitude };
  }

  // É uma boa prática fechar a conexão do cliente quando a aplicação desliga
  async onModuleDestroy() {
    await this.client.close();
  }
}
