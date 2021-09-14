export default class Boid {
  private _id: number;
  private _x: number;
  private _y: number;
  private _color: string;
  private _size: number;
  private _last_x: number;
  private _last_y: number;

  public get id(): number {
    return this._id;
  }

  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._last_x = this._x;
    this._x = value;
  }

  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._last_y = this._y;
    this._y = value;
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

  constructor(id: number, x: number, y: number, size: number, color: string) {
    this._id = id;
    this._x = x;
    this._y = y;
    this._size = size;
    this._color = color;
  }

  public walk(x: number, y: number) {
    this.x = this.x + x;
    this.y = this.y + y;
  }
}
