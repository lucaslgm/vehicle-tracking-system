export class VehicleDeletedEvent {
  static readonly eventName = 'vehicle.deleted';

  constructor(
    public readonly id: string,
    public readonly vin: string,
    public readonly license_plate: string,
  ) {}
}
