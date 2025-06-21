export class VehicleHistoryResponseDto {
  vehicleId: string;
  positions: Array<{
    id: number;
    latitude: number;
    longitude: number;
    timestamp: Date;
  }>;
}
