// Controller para o endpoint interno de registro de veículos.

import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';
import { RegisterVehicleCommand } from './commands/register-vehicle.command';

@Controller('internal/vehicles')
export class VehicleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async registerVehicle(@Body(new ValidationPipe()) body: RegisterVehicleDto) {
    // Em vez de chamar um serviço, disparamos um comando.
    return this.commandBus.execute(
      new RegisterVehicleCommand(body.vin, body.license_plate),
    );
  }
}
