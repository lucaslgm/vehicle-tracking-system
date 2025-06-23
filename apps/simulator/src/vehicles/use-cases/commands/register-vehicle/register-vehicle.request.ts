import { LICENSE_PLATE_REGEX } from '@app/common/constants/regex';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterVehicleRequest {
  @ApiProperty({ example: 'ABC-1234', description: 'Placa do veículo' })
  @IsString()
  @IsNotEmpty()
  @Matches(LICENSE_PLATE_REGEX, {
    message: 'A placa deve estar no formato ABC-1234 ou ABC1D23',
  })
  license_plate: string;

  @ApiProperty({
    example: '123456789ABCDEFGH',
    description: 'Vehicle Identification Number (17 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(17)
  vin: string;
}
