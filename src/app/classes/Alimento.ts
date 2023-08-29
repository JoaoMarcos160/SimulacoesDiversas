import { AlimentoTipo } from '../enums/AlimentoTipoEnum';

export class Alimento {
  private $x: number = 0;
  private $y: number = 0;
  private $tipo: AlimentoTipo = AlimentoTipo.tipo1;

  public get x(): number {
    return this.$x;
  }
  public get y(): number {
    return this.$y;
  }
  public get tipo(): AlimentoTipo {
    return this.$tipo;
  }

  constructor(x: number, y: number, tipo: AlimentoTipo) {
    this.$x = x;
    this.$y = y;
    this.$tipo = tipo;
  }
}
