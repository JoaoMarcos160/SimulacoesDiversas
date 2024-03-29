import Boid from './Boid';
import Step from './Step';

export default class Predator extends Boid {
  private _attack_range: number;
  private _preys_eaten: number;

  public get attack_range(): number {
    return this._attack_range;
  }
  public get preys_eaten(): number {
    return this._preys_eaten;
  }

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
    mating_rate: number,
    fertility: number,
    attack_range: number,
    preys_eaten: number = 0,
    steps: Step[] = []
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
      mating_rate,
      fertility,
      steps
    );
    this._attack_range = attack_range;
    this._preys_eaten = preys_eaten;
  }

  public eatPrey(sizePrey: number): void {
    this._preys_eaten++;
    this.hungry = this.hungry - 20 - sizePrey;
  }

  public mate(partner: Predator): Predator[] {
    const children: Boid[] = super.mate(partner);
    const predators: Predator[] = [];
    children.forEach((child: Boid) => {
      predators.push(
        new Predator(
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
          child.mating_rate,
          child.fertility,
          Boid.mergeValuesOfGene(this.attack_range, partner.attack_range)
        )
      );
    });
    return predators;
  }
}
