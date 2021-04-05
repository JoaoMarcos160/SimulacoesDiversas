import { Direcao } from '../enums/DirecaoEnum';

var tamanhoDoWalker = 30;

export class Walker {
  public x: number = 0;
  public y: number = 0;
  public corDaBorda: string = '#000000';
  public passos: { direcao: Direcao; forca: number }[] = [];

  constructor(width: number, heigth: number, corDaBorda = '#000000') {
    // this.nascer(width, heigth, corDaBorda);
    this.x = Math.max(width, 0);
    this.y = Math.max(heigth, 0);
    this.corDaBorda = corDaBorda;
  }

  // nascer(width: number, heigth: number, corDaBorda = 'red') {
  // }

  andar() {
    if (this.passos.length > 0) {
      let passo = this.passos.shift();
      switch (passo?.direcao) {
        case Direcao.Cima:
          this.irParaCima(passo.forca);
          break;
        case Direcao.Baixo:
          this.irParaBaixo(passo.forca);
          break;
        case Direcao.Direita:
          this.irParaDireita(passo.forca);
          break;
        case Direcao.Esquerda:
          this.irParaEsquerda(passo.forca);
          break;
        case Direcao.CimaDireita:
          this.irParaCima(passo.forca);
          this.irParaDireita(passo.forca);
          break;
        case Direcao.CimaEsquerda:
          this.irParaCima(passo.forca);
          this.irParaEsquerda(passo.forca);
          break;
        case Direcao.BaixoDireita:
          this.irParaBaixo(passo.forca);
          this.irParaDireita(passo.forca);
          break;
        case Direcao.BaixoEsquerda:
          this.irParaBaixo(passo.forca);
          this.irParaEsquerda(passo.forca);
          break;
        default:
          console.log('Direcao ' + passo?.direcao + ' não mapeada');
          break;
      }
    }
  }

  acrescentarPassos(direcao: Direcao, forca: number) {
    this.passos.push({ direcao: direcao, forca: forca });
  }

  //ao usar o andar não há necessidade de retirar o passo, pois ele já retira
  retirarPasso() {
    this.passos.shift();
  }

  private irParaCima(forca: number) {
    this.y = Math.max(this.y - forca, 0);
  }

  private irParaBaixo(forca: number) {
    this.y = Math.min(this.y + forca, window.innerHeight - tamanhoDoWalker);
  }

  private irParaDireita(forca: number) {
    this.x = Math.min(this.x + forca, window.innerWidth - tamanhoDoWalker);
  }

  private irParaEsquerda(forca: number) {
    this.x = Math.max(this.x - forca, 0);
  }
}
