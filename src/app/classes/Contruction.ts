import { ContructionTypeEnum } from "../enums/ContructionTypeEnum";

export class Contruction {
    private _id: number;
    private _x: number;
    private _y: number;
    private _type: ContructionTypeEnum;

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

    constructor(id: number, x: number, y: number, type: ContructionTypeEnum) {
        this._id = id
        this._x = x
        this._y = y
        this._type = type
    }

}