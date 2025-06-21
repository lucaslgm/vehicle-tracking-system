export class GetVehicleHistoryQuery {
  constructor(
    public readonly licensePlate: string,
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}
