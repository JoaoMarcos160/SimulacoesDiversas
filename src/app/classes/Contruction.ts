import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';

export default class Construction {
  private _id: number;
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _type: ConstructionTypeEnum;

  public get id(): number {
    return this._id;
  }
  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
  public get type(): number {
    return this._type;
  }
  public get width(): number {
    return this._width;
  }
  public get height(): number {
    return this._height;
  }

  constructor(
    id: number,
    x: number,
    y: number,
    type: ConstructionTypeEnum,
    width: number,
    height: number
  ) {
    this._id = id;
    this._x = x;
    this._y = y;
    this._type = type;
    this._width = width;
    this._height = height;
  }
}
