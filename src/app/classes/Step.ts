export class Step {
  public distance_x: number;
  public distance_y: number;

  constructor(x: number, y: number) {
    (this.distance_x = x), (this.distance_y = y);
  }
}
