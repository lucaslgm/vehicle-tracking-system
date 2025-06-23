import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class RegisterVehiclePositionRequest {
  @ApiProperty({
    example: 'e7c9e2b0-1c2d-4e5f-8a7b-9c0d1e2f3a4b',
    description: 'ID do veículo (UUID)',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ example: -23.55052, description: 'Latitude do veículo' })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: -46.633308, description: 'Longitude do veículo' })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  constructor(vehicleId: string, latitude: number, longitude: number) {
    this.vehicleId = vehicleId;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
