import { IVehicle } from '../../../shared/interfaces/vehicle.interface';

export class DeleteVehicleResponse {
  constructor(public readonly vehicle: IVehicle) {}
}
