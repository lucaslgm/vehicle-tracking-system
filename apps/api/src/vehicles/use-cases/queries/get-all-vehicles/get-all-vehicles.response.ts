export interface IVehicle {
  id: string;
  license_plate: string;
  vin: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class GetAllVehiclesResponseDto {
  readonly vehicles: IVehicle[];
  readonly total: number;

  constructor(data: IVehicle[]) {
    this.vehicles = data;
    this.total = data.length;
  }
}
