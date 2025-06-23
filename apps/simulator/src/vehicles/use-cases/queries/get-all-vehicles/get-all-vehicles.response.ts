import { IVehicle } from '../../../shared/interfaces/vehicle.interface';

export class GetAllVehiclesResponse {
  constructor(
    public readonly vehicles: IVehicle[],
    public readonly total: number = vehicles.length,
  ) {}
}
