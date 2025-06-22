import { IVehicle } from '../../../shared/interfaces/vehicle.interface';

export class GetVehicleByIdResponse {
  readonly vehicles: IVehicle;

  constructor(data: IVehicle) {
    this.vehicles = data;
  }
}
