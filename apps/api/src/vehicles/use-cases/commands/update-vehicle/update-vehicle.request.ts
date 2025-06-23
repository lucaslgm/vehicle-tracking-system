import { LICENSE_PLATE_REGEX } from '@app/common/constants/regex';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdateVehicleRequest {
  @ApiProperty({ example: 'ABC-1234', description: 'Placa do veículo' })
  @IsString()
  @IsNotEmpty()
  @Matches(LICENSE_PLATE_REGEX, {
    message: 'The license plate must be in the format ABC-1234 or ABC1D23',
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
