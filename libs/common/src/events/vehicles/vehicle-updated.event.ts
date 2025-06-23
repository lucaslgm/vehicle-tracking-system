export class VehicleUpdatedEvent {
  static readonly eventPattern = 'vehicle.updated';

  constructor(
    public readonly oldVin: string,
    public readonly vin: string,
    public readonly license_plate: string,
  ) {}
}
