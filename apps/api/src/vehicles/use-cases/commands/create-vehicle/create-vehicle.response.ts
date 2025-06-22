import { IVehicle } from '../../../shared/interfaces/vehicle.interface';

export class CreateVehicleResponse {
  constructor(public readonly vehicle: IVehicle) {}
}
