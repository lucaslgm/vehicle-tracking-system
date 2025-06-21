// src/features/vehicles/vehicles.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';

// DTOs e Comandos/Queries
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { VehicleResponseDto } from './dtos/vehicle.response.dto';
import { CreateVehicleCommand } from './use-cases/commands/impl/create-vehicle.command';
// import { PositionUpdateHandler } from './events/position-update.handler';
import { UpdateVehicleCommand } from './use-cases/commands/impl/update-vehicle.command';
import { DeleteVehicleCommand } from './use-cases/commands/impl/delete-vehicle.command';
import { GetHistoryDto } from './dtos/get-history.dto';
import { GetAllVehiclesQuery } from './use-cases/queries/get-all-vehicles/get-all-vehicles.query';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { GetVehicleByIdQuery } from './use-cases/queries/get-vehicle-by-id/get-vehicle-by-id.query';
import { GetVehicleHistoryQuery } from './use-cases/queries/get-vehicle-history/get-vehicle-history.query';

@ApiTags('Vehicles')
@ApiSecurity('ApiToken')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    // private readonly positionUpdateHandler: PositionUpdateHandler,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'The vehicle has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 409,
    description: 'Vehicle with VIN or license plate already exists.',
  })
  @ApiBody({ type: CreateVehicleDto })
  @HttpCode(HttpStatus.CREATED)
  async createVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.commandBus.execute(new CreateVehicleCommand(createVehicleDto));
  }

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'List of all vehicles with their current position.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.queryBus.execute(new GetAllVehiclesQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by its ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vehicle found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @HttpCode(HttpStatus.OK)
  async getVehicleById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<VehicleResponseDto> {
    return this.queryBus.execute(new GetVehicleByIdQuery(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'The vehicle has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 409,
    description: 'Vehicle with VIN or license plate already exists.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.commandBus.execute(new UpdateVehicleCommand(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The vehicle has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commandBus.execute(new DeleteVehicleCommand(id));
  }

  @Get(':license_plate/history')
  @ApiOperation({ summary: "Get a vehicle's location history" })
  @ApiParam({ name: 'license_plate', type: 'string', example: 'ABC-1234' })
  @ApiResponse({ status: 200, description: 'List of historical positions.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @HttpCode(HttpStatus.OK)
  findHistory(
    @Param('license_plate') licensePlate: string,
    @Query() dto: GetHistoryDto,
  ) {
    return this.queryBus.execute(
      new GetVehicleHistoryQuery(licensePlate, dto.start_date, dto.end_date),
    );
  }
}
