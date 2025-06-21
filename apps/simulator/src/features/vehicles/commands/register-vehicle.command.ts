export class RegisterVehicleCommand {
  constructor(
    public readonly vin: string,
    public readonly license_plate: string,
  ) {}
}
