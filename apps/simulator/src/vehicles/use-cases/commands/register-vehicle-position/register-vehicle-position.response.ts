import { IVehiclePosition } from '../../../shared/interfaces/vehicle-position.interface';

export class RegisterVehiclePositionRequestResponse {
  constructor(public readonly vehiclePosition: IVehiclePosition) {}
}
