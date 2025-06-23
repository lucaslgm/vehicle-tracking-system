import { IVehicle } from '../../../shared';

export class GetVehicleByIdResponse {
  readonly vehicles: IVehicle;

  constructor(data: IVehicle) {
    this.vehicles = data;
  }
}
