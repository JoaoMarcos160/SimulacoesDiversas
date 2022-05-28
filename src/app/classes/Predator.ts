import Boid from './Boid';

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
    attack_range: number
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
    this._preys_eaten = 0;
    this._attack_range = attack_range;
  }

  public eatPrey(sizePrey: number): void {
    this._preys_eaten++;
    this.hungry = this.hungry - 20 - sizePrey;
  }


  public mate(partner: Predator): Predator[] {
    const children: Boid[] = super.mate(partner);
    const predators: Predator[] = [];
    children.forEach((child: Boid) => {
      predators.push(new Predator(
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
        Boid.mergeValuesOfGene(this.attack_range, partner.attack_range)
      ));
    });
    return predators;
  }
}
