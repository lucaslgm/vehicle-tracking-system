import { IVehicleHistory } from '@app/common/interfaces';

export class GetVehicleHistoryResponse {
  constructor(public readonly vehicleHistory: IVehicleHistory) {}
}
