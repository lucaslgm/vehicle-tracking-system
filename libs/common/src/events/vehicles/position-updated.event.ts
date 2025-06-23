export class PositionUpdatedEvent {
  constructor(
    public readonly vin: string,
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}
