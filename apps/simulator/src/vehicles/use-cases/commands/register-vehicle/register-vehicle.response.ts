import { IVehicle } from '../../../shared/interfaces/vehicle.interface';

export class RegisterVehicleResponse {
  constructor(public readonly vehicle: IVehicle) {}
}
