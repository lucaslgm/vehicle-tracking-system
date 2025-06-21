export interface IPosition {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface IVehicleHistory {
  vehicleId: string;
  positions: Array<IPosition>;
}

export class GetVehicleHistoryResponse {
  vehicleHistory: IVehicleHistory;

  constructor(data: IVehicleHistory) {
    this.vehicleHistory = data;
  }
}
