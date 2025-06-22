import { IVehicle } from '../../../shared/interfaces/vehicle.interface';

export class UpdateVehicleResponse {
  constructor(public readonly vehicle: IVehicle) {}
}
