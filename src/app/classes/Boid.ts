import Construction from './Contruction';
import { Step } from './Step';

export default class Boid {
  private readonly _id: number;
  private readonly _width: number;
  private readonly _height: number;
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

  public get id(): number {
    return this._id;
  }

  public get width(): number {
    return this._width - this.size;
  }

  public get heigth(): number {
    return this._height - this.size;
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

  public get thirst(): number {
    return this._thirst;
  }

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
    hungry: number,
    thirst: number
  ) {
    this._id = id;
    this._width = width;
    this._height = height;
    this._x = x;
    this._y = y;
    this._size = size;
    this._color = color;
    this._velocity = velocity;
    this._vision = vision;
    this._hungry = hungry;
    this._thirst = thirst;
  }

  private walk(x: number, y: number) {
    this.x = this.x + x * this._velocity;
    this.y = this.y + y * this._velocity;
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

  public constructionsNearby(contructions: Construction[]): Construction[] {
    return contructions.filter(
      (element) =>
        Math.hypot(element.x - this.x, element.y - this.y) < this.vision
    );
  }

  public tracePathToConstruction(construction: Construction) {
    const dx = this.x - construction.x;
    const dy = this.y - construction.y;
    const angleDegrees = Math.atan2(dy, dx) * 57.2957795131;

    const angleToBoid = angleDegrees < 0 ? angleDegrees + 360 : angleDegrees;
    const equation = Boid.findEquationOfALine(
      construction.x,
      construction.y,
      this.x,
      this.y
    );
    const distance = Math.hypot(dx, dy);
    const stepsToContruction = distance / this._velocity;

    if (angleToBoid < 90 || 270 < angleToBoid) {
      for (let x = this.x; x > construction.x; x--) {
        this.addStep(
          new Step(
            (x - this.x) / stepsToContruction,
            (eval(equation) - this.y) / stepsToContruction
          )
        );
      }
    } else {
      for (let x = this.x; construction.x > x; x++) {
        this.addStep(
          new Step(
            (x - this.x) / stepsToContruction,
            (eval(equation) - this.y) / stepsToContruction
          )
        );
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
}
