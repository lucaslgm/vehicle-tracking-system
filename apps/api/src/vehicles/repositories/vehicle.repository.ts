import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { Prisma, Vehicle } from '@db/api';

@Injectable()
export class VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany();
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async findByVin(vin: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({ where: { vin } });
  }

  async findByVinOrPlate(
    vin: string,
    license_plate: string,
  ): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: {
        OR: [{ vin }, { license_plate }],
      },
    });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return this.prisma.vehicle.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Vehicle> {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
