import { uid } from 'uid';
import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import { mixColorsRGB } from '../funcoes/core';
import { getRandomInt, getRandomNumber } from '../funcoes/sorteios';
import Construction from './Contruction';
import Step from './Step';

export default class Boid {
  private readonly _id: string;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _id_father: string;
  private readonly _id_mother: string;
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
  private _mating: number;
  private _hunger_rate: number;
  private _thirst_rate: number;
  private _mating_rate: number;
  private _fertility: number;

  public get id(): string {
    return this._id;
  }

  public get width(): number {
    return this._width - this.size;
  }

  public get height(): number {
    return this._height - this.size;
  }

  public get id_father(): string {
    return this._id_father;
  }

  public get id_mother(): string {
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
    this._y = Math.min(Math.max(value, 0), this.height);
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

  public get quantitySteps(): number {
    return this.steps.length;
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

  public get readyToMate(): boolean {
    return this.mating > 90;
  }

  public get mating(): number {
    return this._mating;
  }

  public set mating(value: number) {
    this._mating = Math.max(0, Math.min(100, value));
  }

  public get hunger_rate(): number {
    return this._hunger_rate;
  }

  public get thirst_rate(): number {
    return this._thirst_rate;
  }

  public get mating_rate(): number {
    return this._mating_rate;
  }

  public get fertility(): number {
    return this._fertility;
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
    steps: Step[] = []
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
    this._mating = 0;
    this._hunger_rate = hunger_rate;
    this._thirst_rate = thirst_rate;
    this._mating_rate = mating_rate;
    this._fertility = fertility;
    this._steps = steps;
  }

  private walk(x: number, y: number) {
    this.x = this.x + x * this._velocity;
    this.y = this.y + y * this._velocity;

    this.increasesHunger();
    this.increasesThirst();
    this.increasesMating();
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
    onlyResourceAvaiable: boolean = false,
    type: ConstructionTypeEnum = null
  ): Construction {
    let constructionsNearby = this.constructionsNearby(constructions);
    if (type !== null) {
      constructionsNearby = constructionsNearby.filter(
        (construction) => construction.type === type
      );
    }
    if (onlyResourceAvaiable) {
      return constructionsNearby
        .filter((a) => a.resource > 0)
        .sort((a, b) => (this.distanceOf(a) < this.distanceOf(b) ? -1 : 1))[0];
    }
    constructionsNearby.sort((a, b) =>
      this.distanceOf(a) < this.distanceOf(b) ? -1 : 1
    );
    return constructionsNearby[0];
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
    maxSteps: number = 100
  ): void {
    const dx = this.x - coordinate.x;
    const dy = this.y - coordinate.y;

    let x_inverter = 0;
    let y_inverter = 0;
    if (dx < 0) {
      x_inverter = 1;
    } else if (dx > 0) {
      x_inverter = -1;
    }

    if (dy < 0) {
      y_inverter = 1;
    } else if (dy > 0) {
      y_inverter = -1;
    }

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

  private increasesHunger(multiplier: number = 1) {
    this.hungry += this._hunger_rate * (this.size / 10) * multiplier * 0.001;
  }

  private increasesThirst(multiplier: number = 1) {
    this.thirst += this._thirst_rate * (this.size / 10) * multiplier * 0.001;
  }

  private increasesMating() {
    this.mating += this._mating_rate * (this.size / 10) * 0.001;
  }

  public drinkWater() {
    this.thirst -= 15;
  }

  public tracePathToRandomDirection(maxSteps = 15) {
    this.tracePathToCoordinate(
      { x: getRandomInt(0, this.width), y: getRandomInt(0, this.height) },
      maxSteps
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

  public mate(partner: Boid): Boid[] {
    const quantityChildren = getRandomInt(
      Math.floor(Math.min(this.fertility, partner.fertility)),
      Math.ceil(Math.max(this.fertility, partner.fertility))
    );
    const children = [];
    for (let i = 0; i < quantityChildren; i++) {
      const newBoid = new Boid(
        uid(this.id.length),
        Boid.mergeValuesOfGene(this.width, partner.width),
        Boid.mergeValuesOfGene(this.height, partner.height),
        this.id,
        partner.id,
        this.x,
        this.y,
        Boid.mergeValuesOfGene(this.size, partner.size),
        mixColorsRGB(0.5, this.color, partner.color),
        Boid.mergeValuesOfGene(this.velocity * 100, partner.velocity * 100) /
          100,
        Boid.mergeValuesOfGene(this.vision, partner.vision),
        Boid.mergeValuesOfGene(this.hunger_rate, partner.hunger_rate),
        Boid.mergeValuesOfGene(this.thirst_rate, partner.thirst_rate),
        Boid.mergeValuesOfGene(this.mating_rate, partner.mating_rate),
        Boid.mergeValuesOfGene(this.fertility, partner.fertility)
      );
      children.push(newBoid);
    }
    this.mating = 0;
    partner.mating = 0;
    this.increasesHunger(quantityChildren * 1.5);
    return children;
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

  public static mergeValuesOfGene(value1: number, value2: number): number {
    return getRandomNumber(Math.min(value1, value2), Math.max(value1, value2));
  }
}
