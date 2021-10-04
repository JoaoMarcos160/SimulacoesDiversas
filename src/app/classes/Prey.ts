import Boid from './Boid';

export default class Prey extends Boid {
  constructor(
    id: number,
    width: number,
    height: number,
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: number,
    vision: number,
    hunger_rate: number,
    thirst_rate: number
  ) {
    super(
      id,
      width,
      height,
      x,
      y,
      size,
      color,
      velocity,
      vision,
      hunger_rate,
      thirst_rate
    );
  }

  public eatFood() {
    this.hungry = this.hungry - 15;
  }

  public escapeFromPredator(predator: { x: number; y: number }) {
    this.clearSteps();
    const dx = this.x - predator.x;

    const x_inverter: 1 | -1 = dx > 0 ? 1 : -1;
    const equation: string = Prey.findEquationOfALine(
      this.x,
      this.y,
      predator.x,
      predator.y
    );

    const x = this.x + 150 * x_inverter;
    const y = eval(equation);
    this.tracePathToCoordinate({ x, y }, 200);
  }

  public static findEquationOfALine(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): string {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return `${m} * x + ${b}`;
  }
}
