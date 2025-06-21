// Camada de acesso a dados para o histórico.

import { Injectable } from '@nestjs/common';
import { Prisma, VehiclePosition } from '@db/simulator';
import { PrismaService } from 'apps/simulator/src/core/database/prisma/prisma.service';

@Injectable()
export class PositionHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VehiclePositionCreateInput) {
    return this.prisma.vehiclePosition.create({ data });
  }

  async findHistoryByPlate(
    license_plate: string,
    startDate: Date,
    endDate: Date,
  ): Promise<VehiclePosition[]> {
    const result = await this.prisma.vehiclePosition.findMany({
      where: {
        vehicle: {
          license_plate: license_plate,
        },
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return result;
  }
}
