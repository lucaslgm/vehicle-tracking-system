import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { IVehicle } from '../shared/interfaces/vehicle.interface';
import { IVehiclePosition } from '../shared/interfaces/vehicle-position.interface';

@Injectable()
export class VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerVehicle(license_plate: string, vin: string): Promise<IVehicle> {
    return this.prisma.vehicle.create({
      data: {
        license_plate: license_plate,
        vin: vin,
      },
    });
  }

  async findByVinOrPlate(
    vin: string,
    license_plate: string,
  ): Promise<IVehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: {
        OR: [{ vin }, { license_plate }],
      },
    });
  }

  async findAll(): Promise<IVehicle[]> {
    return this.prisma.vehicle.findMany();
  }

  async findHistoryByPlate(
    license_plate: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IVehiclePosition[]> {
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

  async registerPosition(
    vehicleId: string,
    latitude: number,
    longitude: number,
  ): Promise<IVehiclePosition> {
    return this.prisma.vehiclePosition.create({
      data: { vehicleId, latitude, longitude },
    });
  }
}
