import { IVehicleHistory } from '@app/common/interfaces/vehicle-history.interface';

export class GetVehiclePositionHistoryResponse {
  constructor(public readonly vehicleHistory: IVehicleHistory) {}
}
