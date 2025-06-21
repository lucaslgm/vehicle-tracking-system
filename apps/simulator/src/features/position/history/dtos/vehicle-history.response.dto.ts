export class VehicleHistoryResponseDto {
  vehicleId: string;
  positions: Array<{
    id: number;
    latitude: number;
    longitude: number;
    timestamp: Date;
  }>;

  constructor(
    vehicleId: string,
    positions: Array<{
      id: number;
      latitude: number;
      longitude: number;
      timestamp: Date;
    }>,
  ) {
    this.vehicleId = vehicleId;
    this.positions = positions;
  }
}
