import { Direcao } from '../enums/DirecaoEnum';
import { sortearDirecao, sortearTamanhoDoPasso } from '../funcoes/sorteios';
import { Alimento } from './Alimento';
import { Passo } from './Passo';

export class Walker {
  public x: number = 0;
  public y: number = 0;
  public corDaBorda: string = '#000000';
  private passos: Passo[] = [];
  private ultimosPassosDados: Passo[] = [];
  public tamanho: number = 0;
  public velocidade: number = 750; //tempo em milisegundos para ele andar
  public forcaDeVontade: number = 1; //numeros de 1 a 10

  constructor(
    width: number,
    heigth: number,
    corDaBorda = '#000000',
    tamanho: number,
    velocidade: number,
    forcaDeVontade: number
  ) {
    this.x = Math.max(width, 0);
    this.y = Math.max(heigth, 0);
    this.corDaBorda = corDaBorda;
    this.tamanho = tamanho;
    this.velocidade = velocidade;
    this.forcaDeVontade = forcaDeVontade;
  }

  comecarAndar(alimentos: Alimento[]) {
    setInterval(() => {
      let retorno = this.alimentoMaisProximo(alimentos);
      if (retorno.distancia < this.forcaDeVontade * 4) {
        this.passosParaUmAlimento(retorno.alimento);
      } else {
        this.acrescentarPassos(sortearDirecao(), sortearTamanhoDoPasso());
      }
      this.andar();
    }, this.velocidade);
  }

  private acrescentarUltimoPassoDado(passo: Passo) {
    if (this.ultimosPassosDados.length > 5) {
      this.ultimosPassosDados.shift();
    }
    this.ultimosPassosDados.push(passo);
  }

  private andar() {
    if (this.passos.length > 0) {
      let passo = this.passos.shift();
      if (passo) this.acrescentarUltimoPassoDado(passo);
      switch (passo?.direcao) {
        case Direcao.Cima:
          this.irParaCima(passo.tamanhoDoPasso);
          break;
        case Direcao.Baixo:
          this.irParaBaixo(passo.tamanhoDoPasso);
          break;
        case Direcao.Direita:
          this.irParaDireita(passo.tamanhoDoPasso);
          break;
        case Direcao.Esquerda:
          this.irParaEsquerda(passo.tamanhoDoPasso);
          break;
        case Direcao.CimaDireita:
          this.irParaCima(passo.tamanhoDoPasso);
          this.irParaDireita(passo.tamanhoDoPasso);
          break;
        case Direcao.CimaEsquerda:
          this.irParaCima(passo.tamanhoDoPasso);
          this.irParaEsquerda(passo.tamanhoDoPasso);
          break;
        case Direcao.BaixoDireita:
          this.irParaBaixo(passo.tamanhoDoPasso);
          this.irParaDireita(passo.tamanhoDoPasso);
          break;
        case Direcao.BaixoEsquerda:
          this.irParaBaixo(passo.tamanhoDoPasso);
          this.irParaEsquerda(passo.tamanhoDoPasso);
          break;
        default:
          console.log('Direcao ' + passo?.direcao + ' não mapeada');
          break;
      }
    }
  }

  acrescentarPassos(direcao: Direcao, forca: number) {
    this.passos.push(new Passo(direcao, forca));
  }

  //ao usar o andar não há necessidade de retirar o passo, pois ele já retira
  retirarPasso() {
    this.passos.shift();
  }

  private alimentoMaisProximo(
    alimentos: Alimento[]
  ): { alimento: Alimento; distancia: number } {
    let distancias: { alimento: Alimento; distancia: number }[] = [];
    alimentos.forEach((element) => {
      distancias.push({
        alimento: element,
        distancia: Math.hypot(element.x - this.x, element.y - this.y),
      });
    });
    distancias = distancias.sort((a, b) =>
      a.distancia < b.distancia ? -1 : 1
    );
    return distancias[0];
  }

  private passosParaUmAlimento(alimento: Alimento) {
    this.x = alimento.x;
    this.y = alimento.y;
  }

  private irParaCima(forca: number) {
    this.y = Math.min(
      this.y + forca,
      window.innerHeight - (this.tamanho + 20) * 2
    );
  }

  private irParaBaixo(forca: number) {
    this.y = Math.max(this.y - forca, 0);
  }

  private irParaDireita(forca: number) {
    this.x = Math.min(
      this.x + forca,
      window.innerWidth - (this.tamanho + 20) * 2
    );
  }

  private irParaEsquerda(forca: number) {
    this.x = Math.max(this.x - forca, 0);
  }
}
