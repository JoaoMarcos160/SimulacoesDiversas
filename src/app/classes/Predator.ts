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
    id: number,
    width: number,
    height: number,
    id_father: number,
    id_mother: number,
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: number,
    vision: number,
    hunger_rate: number,
    thirst_rate: number,
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
      thirst_rate
    );
    this._preys_eaten = 0;
    this._attack_range = attack_range;
  }

  public eatPrey() {
    this._preys_eaten++;
    this.hungry = this.hungry - 20;
  }
}
