import Boid from './Boid';

export default class Prey extends Boid {
  constructor(
    id: string,
    width: number,
    height: number,
    id_father: string,
    id_mother: string,
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: number,
    vision: number,
    hunger_rate: number,
    thirst_rate: number,
    mating_rate: number
  ) {
    super(
      id,
      width,
      height,
      id_father,
      id_mother,
      x,
      y,
      size,
      color,
      velocity,
      vision,
      hunger_rate,
      thirst_rate,
      mating_rate
    );
  }

  public eatFood() {
    this.hungry = this.hungry - 15;
  }

  public escapeFromPredator(predator: { x: number; y: number }) {
    this.clearSteps();
    const dx = this.x - predator.x;

    const x_inverter: 1 | -1 = dx > 0 ? 1 : -1;
    const equation: string = Boid.findEquationOfALine(
      this.x,
      this.y,
      predator.x,
      predator.y
    );

    const x = this.x + 150 * x_inverter;
    const y = eval(equation);
    this.tracePathToCoordinate({ x, y }, 200);
  }

  public mate(partner: Prey): Prey[] {
    const children: Boid[] = super.mate(partner);
    const preys: Prey[] = [];
    children.forEach((child: Boid) => {
      preys.push(new Prey(
        child.id,
        child.width,
        child.height,
        child.id_father,
        child.id_mother,
        child.x,
        child.y,
        child.size,
        child.color,
        child.velocity,
        child.vision,
        child.hunger_rate,
        child.thirst_rate,
        child.mating_rate
      ));
    });
    return preys;
  }
}
