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
