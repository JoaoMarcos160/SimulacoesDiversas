import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import { getRandomInt } from '../funcoes/sorteios';

export default class Construction {
  private _id: number;
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _type: ConstructionTypeEnum;
  private _resource: number;
  private _max_resource: number;
  private _resource_rate: number;

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
  public get resource(): number {
    return this._resource;
  }
  public set resource(value: number) {
    this._resource = Math.max(0, Math.min(this.max_resource, value));
  }
  public get max_resource(): number {
    return this._max_resource;
  }
  public get resource_rate(): number {
    return this._resource_rate;
  }

  constructor(
    id: number,
    x: number,
    y: number,
    type: ConstructionTypeEnum,
    width: number,
    height: number,
    resource: number,
    resource_rate: number
  ) {
    this._id = id;
    this._x = x;
    this._y = y;
    this._type = type;
    this._width = width;
    this._height = height;
    this._resource = resource;
    this._max_resource = resource;
    this._resource_rate = resource_rate;
  }

  public increasesResources() {
    this.resource += this.resource_rate;
  }
  public decreasesResources(value: number) {
    this.resource -= value;
  }
}
