import { IVehicle } from '../../../shared';

export class GetAllVehiclesResponse {
  constructor(
    public readonly vehicles: IVehicle[],
    public readonly total: number = vehicles.length,
  ) {}
}
