import { Direcao } from '../enums/DirecaoEnum';

export class Passo {
  private $direcao: Direcao = Direcao.Cima;
  private $tamanhoDoPasso: number = 0;

  public get direcao(): Direcao {
    return this.$direcao;
  }
  public get tamanhoDoPasso(): number {
    return this.$tamanhoDoPasso;
  }

  constructor(direcao: Direcao, tamanhoDoPasso: number) {
    this.$direcao = direcao;
    this.$tamanhoDoPasso = tamanhoDoPasso;
  }
}
