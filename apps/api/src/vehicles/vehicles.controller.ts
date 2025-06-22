import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import {
  GetAllVehiclesQuery,
  GetAllVehiclesResponse,
  GetVehicleByIdQuery,
  GetVehicleByIdResponse,
  GetVehicleHistoryRequest,
  GetVehicleHistoryQuery,
  GetVehicleHistoryResponse,
} from './use-cases/queries';
import {
  CreateVehicleRequest,
  CreateVehicleCommand,
  CreateVehicleResponse,
  UpdateVehicleRequest,
  UpdateVehicleCommand,
  UpdateVehicleResponse,
  DeleteVehicleCommand,
  DeleteVehicleResponse,
} from './use-cases/commands';
import {
  ApiCreateResponse,
  ApiDeleteResponse,
  ApiReadAllByFilterResponse,
  ApiReadAllResponse,
  ApiReadOneResponse,
  ApiUpdateResponse,
} from './shared/swagger/api-responses';

@ApiTags('Vehicles')
@ApiSecurity('ApiToken')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiBody({ type: CreateVehicleRequest })
  @ApiCreateResponse('Vehicle')
  async createVehicle(
    @Body() CreateVehicleRequest: CreateVehicleRequest,
  ): Promise<CreateVehicleResponse> {
    return this.commandBus.execute(
      new CreateVehicleCommand(CreateVehicleRequest),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by its ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiReadOneResponse('Vehicle')
  async getVehicleById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetVehicleByIdResponse> {
    return this.queryBus.execute(new GetVehicleByIdQuery(id));
  }

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiReadAllResponse('Vehicles')
  findAll(): Promise<GetAllVehiclesResponse> {
    return this.queryBus.execute(new GetAllVehiclesQuery());
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateVehicleRequest })
  @ApiUpdateResponse('Vehicle')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateVehicleRequest,
  ): Promise<UpdateVehicleResponse> {
    return this.commandBus.execute(new UpdateVehicleCommand(id, request));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiDeleteResponse('Vehicle')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteVehicleResponse> {
    return this.commandBus.execute(new DeleteVehicleCommand(id));
  }

  @Get(':license_plate/history')
  @ApiOperation({ summary: "Get a vehicle's location history" })
  @ApiParam({ name: 'license_plate', type: 'string', example: 'ABC-1234' })
  @ApiReadAllByFilterResponse('VehicleHistory', {
    list: 'List of historical positions for the vehicle.',
    invalidId: 'Invalid license plate format.',
    notFound: 'Vehicle not found.',
  })
  findHistory(
    @Param('license_plate') licensePlate: string,
    @Query() request: GetVehicleHistoryRequest,
  ): Promise<GetVehicleHistoryResponse> {
    return this.queryBus.execute(
      new GetVehicleHistoryQuery(
        licensePlate,
        request.start_date,
        request.end_date,
      ),
    );
  }
}
