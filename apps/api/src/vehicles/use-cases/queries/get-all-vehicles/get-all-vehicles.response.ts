import { IVehicle } from '../../../shared';

export class GetAllVehiclesResponse {
  readonly vehicles: IVehicle[];
  readonly total: number;

  constructor(data: IVehicle[]) {
    this.vehicles = data;
    this.total = data.length;
  }
}
