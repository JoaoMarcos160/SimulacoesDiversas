import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import { getRandomInt, randn_bm } from '../funcoes/sorteios';
import Construction from './Contruction';
import Step from './Step';

export default class Boid {
  private readonly _id: number;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _id_father: number;
  private readonly _id_mother: number;
  private _x: number;
  private _y: number;
  private _color: string;
  private _size: number;
  private _last_x: number;
  private _last_y: number;
  private _velocity: number;
  private _vision: number;
  private _steps: Step[] = [];
  private _hungry: number;
  private _thirst: number;
  private _hunger_rate: number;
  private _thirst_rate: number;

  public get id(): number {
    return this._id;
  }

  public get width(): number {
    return this._width - this.size;
  }

  public get heigth(): number {
    return this._height - this.size;
  }

  public get id_father(): number {
    return this._id_father;
  }

  public get id_mother(): number {
    return this._id_mother;
  }

  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._last_x = this._x;
    this._x = Math.min(Math.max(value, 0), this.width);
  }

  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._last_y = this._y;
    this._y = Math.min(Math.max(value, 0), this.heigth);
  }

  public get size(): number {
    return this._size;
  }

  public get color(): string {
    return this._color;
  }

  public get last_x(): number {
    return this._last_x;
  }

  public get last_y(): number {
    return this._last_y;
  }

  public get velocity(): number {
    return this._velocity;
  }

  public get vision(): number {
    return this._vision;
  }

  public get steps(): Step[] {
    return this._steps;
  }

  public get hungry(): number {
    return this._hungry;
  }

  public set hungry(value: number) {
    this._hungry = Math.max(0, Math.min(100, value));
  }

  public get thirst(): number {
    return this._thirst;
  }

  public set thirst(value: number) {
    this._thirst = Math.max(0, Math.min(100, value));
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
    thirst_rate: number
  ) {
    this._id = id;
    this._width = width;
    this._height = height;
    this._id_father = id_father;
    this._id_mother = id_mother;
    this._x = x;
    this._y = y;
    this._size = size;
    this._color = color;
    this._velocity = velocity;
    this._vision = vision;
    this._hungry = 0;
    this._thirst = 0;
    this._hunger_rate = hunger_rate;
    this._thirst_rate = thirst_rate;
  }

  private walk(x: number, y: number) {
    this.x = this.x + x * this._velocity;
    this.y = this.y + y * this._velocity;

    this.increasesHunger();
    this.increasesThirst();
  }

  public addStep(step: Step) {
    this._steps.push(step);
  }

  public walkAStep() {
    const step = this.steps.shift();
    if (step !== undefined) {
      this.walk(step.distance_x, step.distance_y);
    }
  }

  public clearSteps() {
    this._steps = [];
  }

  public constructionsNearby(constructions: Construction[]): Construction[] {
    return constructions.filter(
      (element) => this.distanceOf(element) < this.vision
    );
  }

  public constructionNearest(
    constructions: Construction[],
    type: ConstructionTypeEnum = null
  ): Construction {
    let constructionsNearby = this.constructionsNearby(constructions);
    if (type !== null) {
      constructionsNearby = constructionsNearby.filter(
        (construction) => construction.type === type
      );
    }
    return constructionsNearby.sort((a, b) =>
      this.distanceOf(a) < this.distanceOf(b) ? -1 : 1
    )[0];
  }

  public boidsNearby(boids: Boid[], sorted: boolean): Boid[] {
    const foundBoids = boids.filter(
      (element) => this.distanceOf(element) < this.vision
    );
    if (sorted) {
      return foundBoids.sort((a, b) =>
        this.distanceOf(a) < this.distanceOf(b) ? -1 : 1
      );
    }
    return foundBoids;
  }

  public distanceOf(coordinate: { x: number; y: number }): number {
    return Math.hypot(coordinate.x - this.x, coordinate.y - this.y);
  }

  public tracePathToCoordinate(
    coordinate: { x: number; y: number },
    maxSteps: number = 50
  ) {
    const dx = this.x - coordinate.x;
    const dy = this.y - coordinate.y;

    const x_inverter = dx < 0 ? 1 : dx > 0 ? -1 : 0;
    let y_inverter: 1 | -1 | 0 = dy < 0 ? 1 : dy > 0 ? -1 : 0;

    let stepsToContruction = Math.floor(Math.abs(dx)) / this._velocity;
    const sizeStepY = Math.abs(dy / dx);

    if (sizeStepY > 2) {
      stepsToContruction = Math.floor(Math.abs(dy)) / this._velocity;
      const sizeStepX = Math.abs(dx / dy);
      for (let i = 0; i < Math.min(stepsToContruction, maxSteps); i++) {
        this.addStep(new Step(sizeStepX * x_inverter, y_inverter));
      }
    } else {
      for (let i = 0; i < Math.min(stepsToContruction, maxSteps); i++) {
        this.addStep(new Step(x_inverter, sizeStepY * y_inverter));
      }
    }
  }

  private increasesHunger() {
    this.hungry += this._hunger_rate * 0.001;
  }

  private increasesThirst() {
    this.thirst += this._thirst_rate * 0.001;
  }

  public drinkWater() {
    this.thirst -= 15;
  }

  public tracePathToRandomDirection() {
    this.tracePathToCoordinate(
      { x: getRandomInt(0, this.width), y: getRandomInt(0, this.heigth) },
      30
    );
  }

  public avoidOtherBoids(boids: Boid[], min_distance: number): void {
    const nearbyBoids = this.boidsNearby(boids, true);
    if (nearbyBoids.length > 1) {
      const nearbyBoid = nearbyBoids[1];
      //the nearbyBoids[0] is ever the own boid
      if (this.distanceOf(nearbyBoid) < min_distance) {
        this.clearSteps();
        const dx = this.x - nearbyBoid.x;
        const x_inverter: 1 | -1 = dx > 0 ? 1 : -1;

        if (dx === 0) {
          this.tracePathToRandomDirection();
        } else {
          const equation = Boid.findEquationOfALine(
            this.x,
            this.y,
            nearbyBoid.x,
            nearbyBoid.y
          );
          const x = this.x + min_distance * x_inverter;
          const y = eval(equation);
          this.tracePathToCoordinate({ x, y }, min_distance);
        }
      }
    }
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

  //TODO: Fazer eles se reproduzirem passando os genes adiante
}
