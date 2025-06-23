export class GetVehiclePositionHistoryQuery {
  constructor(
    public readonly license_plate: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
