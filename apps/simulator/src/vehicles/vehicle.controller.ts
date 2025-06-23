import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  RegisterVehicleRequest,
  RegisterVehicleCommand,
  RegisterVehicleResponse,
} from './use-cases/commands';
import {
  GetVehiclePositionHistoryRequest,
  GetVehiclePositionHistoryResponse,
  GetVehiclePositionHistoryQuery,
} from './use-cases/queries';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async registerVehicle(
    @Body(new ValidationPipe()) request: RegisterVehicleRequest,
  ): Promise<RegisterVehicleResponse> {
    return this.commandBus.execute(
      new RegisterVehicleCommand(request.vin, request.license_plate),
    );
  }

  @Get(':license_plate/history')
  getHistory(
    @Param('license_plate') license_plate: string,
    @Query() query: GetVehiclePositionHistoryRequest,
  ): Promise<GetVehiclePositionHistoryResponse> {
    return this.queryBus.execute(
      new GetVehiclePositionHistoryQuery(
        license_plate,
        query.start_date,
        query.end_date,
      ),
    );
  }
}
