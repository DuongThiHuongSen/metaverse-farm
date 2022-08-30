export interface ICharacterState {
  canLeaveVehicles: boolean;
  update(timeStep: number): void;
  onInputChange(): void;
}
