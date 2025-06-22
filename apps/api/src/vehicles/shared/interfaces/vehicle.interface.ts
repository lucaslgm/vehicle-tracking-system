export interface IVehicle {
  id: string;
  license_plate: string;
  vin: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
