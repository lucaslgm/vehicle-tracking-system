import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database';
import { IVehicle } from '../shared';
import { IVehiclePosition } from '../shared';

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

  async deleteByVinOrPlate(
    vin: string,
    license_plate: string,
  ): Promise<IVehicle | null> {
    if (vin) {
      return this.prisma.vehicle.delete({
        where: { vin },
      });
    } else {
      return this.prisma.vehicle.delete({
        where: { license_plate },
      });
    }
  }

  async updateByVin(
    oldVin: string,
    vin: string,
    license_plate: string,
  ): Promise<IVehicle | null> {
    return this.prisma.vehicle.update({
      where: { vin: oldVin },
      data: { vin, license_plate },
    });
  }
}
