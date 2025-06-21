// Camada de acesso a dados para a entidade Vehicle.

import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../core/database/prisma/prisma.service';
import { RegisterVehicleDto } from '../dtos/register-vehicle.dto';
import { Vehicle } from '@db/simulator';

@Injectable()
export class VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: RegisterVehicleDto): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: {
        license_plate: data.license_plate,
        vin: data.vin,
      },
    });
  }

  async findByVinOrPlate(vin: string, license_plate: string) {
    return this.prisma.vehicle.findFirst({
      where: {
        OR: [{ vin }, { license_plate }],
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany();
  }
}
