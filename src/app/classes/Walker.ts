import { Direcao } from '../enums/DirecaoEnum';
import { misturarCoresRGB } from '../funcoes/core';
import { sortearDirecao } from '../funcoes/sorteios';
import { Alimento } from './Alimento';
import { Passo } from './Passo';

/**
 * Informações Sobre:
 * Força de Vontade:
 * A força de vontade defini o quão perto eles precisam estar de um alimento pra saltar pra ele
 * A força de vontade maior eles pegam alimentos mais de longe e vice e versa
 *
 * Velocidade:
 * A velocidade é o de quanto em quanto tempo eles fazem uma ação como andar
 * Por exemplo se a velocidade é 750 ele vai fazer as coisas de 750 em 750 milisegundos
 * ou seja, se o tempo for menor ele fará as coisas bem mais rápido
 *
 * Tamanho:
 * O tamanho definirá o padding que um walker tem, mas ele não influencia em outras propriedades
 *
 * Geral:
 * A cada "rodada" que eles completam, sua cor fica mais clara conforme a sua velocidade,
 * ou seja walkers mais rápidos envelhecem mais rápido também, os mais lentos envelhecem devagar,
 * se ele já nascer com uma cor muito próxima do branco, ele terá uma vida mais curta do que algum que
 * nascer com uma cor bem escura
 *
 * Eles sempre andam para direções próximas da sua ultima direção, por exemplo, se ele andou
 * pra cima, seu próximo passo não será pra baixo, será pra no máximo algum de seus lados diretos
 * (se tiver dúvida olhe na função sortearDirecao() no arquivo sorteios.ts)
 */

export class Walker {
  private $id: number = 0;
  private $x: number = 0;
  private $y: number = 0;
  private $passos: Passo[] = [];
  private $ultimosPassosDados: Passo[] = [];
  private $qtdAlimentoComido: number = 0;
  private $numeroDeCiclos: number = 0;
  private $fome: number = 1000;

  public corDaBorda: string = 'rgb(0,0,0)';
  public tamanho: number = 0;
  public velocidade: number = 750; //tempo em milisegundos para ele andar, quanto mais alto mais lento
  public forcaDeVontade: number = 1; //numeros de 1 a 10
  public tamanhoDoPasso: number = 1; //quantos pixels ele anda por vez

  public get id(): number {
    return this.$id;
  }

  public get x(): number {
    return this.$x;
  }

  public get y(): number {
    return this.$y;
  }

  public get qtdAlimentoComido(): number {
    return this.$qtdAlimentoComido;
  }

  public get numeroDeCiclos(): number {
    return this.$numeroDeCiclos;
  }
  public get fome(): number {
    return this.$fome;
  }

  public get ultimoPasso(): Passo {
    return this.$ultimosPassosDados[0];
  }

  public get passosArmazenados(): number {
    return this.$passos.length;
  }

  constructor(
    id: number,
    width: number,
    height: number,
    corDaBorda = 'rgb(0,0,0)',
    tamanho: number,
    velocidade: number,
    forcaDeVontade: number,
    tamanhoDoPasso: number
  ) {
    this.$id = id;
    this.$x = Math.max(width, 0);
    this.$y = Math.max(height, 0);
    this.corDaBorda = corDaBorda;
    this.tamanho = tamanho;
    this.velocidade = velocidade / 5;
    this.forcaDeVontade = forcaDeVontade;
    this.tamanhoDoPasso = 1;
    // this.tamanhoDoPasso = tamanhoDoPasso;
  }

  toString(): string {
    return (
      'Walker ' +
      this.id +
      '\n' +
      'Cor da borda: ' +
      this.corDaBorda +
      '\n' +
      'Força de vontade: ' +
      this.forcaDeVontade +
      '\n' +
      'Tamanho: ' +
      this.tamanho +
      '\n' +
      'Velocidade: ' +
      this.velocidade +
      '\n'
    );
  }
  /**
   *
   * @param alimentos Lista de alimentos disponíveis
   *
   * @returns Faz o walker começar a andar colocando ele num loop de setInterval que se repete na sua velocidade
   */
  comecarAndar(alimentos: Alimento[]) {
    let interval = setInterval(() => {
      if (this.passosArmazenados === 0) {
        if (alimentos.length > 0) {
          let retorno = this.alimentoMaisProximo(alimentos);
          this.passosParaUmAlimento(retorno.alimento);
          if (Math.round(retorno.distancia) < this.forcaDeVontade) {
            this.velocidade = this.velocidade / 2;
            this.comer(retorno.alimento, alimentos);
          } else {
            this.acrescentarPassos(
              sortearDirecao(this.$ultimosPassosDados),
              this.tamanhoDoPasso
            );
          }
        }
      }

      this.$numeroDeCiclos % 10 == 0
        ? (this.corDaBorda = misturarCoresRGB(
            parseFloat((1 / this.velocidade).toFixed(3)),
            this.corDaBorda,
            'rgb(255,255,255)'
          ))
        : null;
      if (this.fome > 0) {
        this.andar();
        this.$fome--;
      } else {
        this.corDaBorda = 'rgb(255,255,0)';
        clearInterval(interval);
      }
      this.$numeroDeCiclos++;
    }, this.velocidade);
  }

  /**
   *
   * @param passo
   * Recebe o ultimo passo dado e coloca no fim de this.$ultimosPassosDados
   */
  private acrescentarUltimoPassoDado(passo: Passo) {
    if (this.$ultimosPassosDados.length > 5) {
      this.$ultimosPassosDados.shift();
    }
    this.$ultimosPassosDados.push(passo);
  }

  /**
   * Executa o primeiro passo que estiver no array this.$passos e joga o passo para this.$ultimosPassosDados
   */
  private andar() {
    let passo = this.$passos.shift();
    if (passo) this.acrescentarUltimoPassoDado(passo);
    switch (passo?.direcao) {
      case Direcao.Cima:
        this.irParaCima(passo.tamanhoDoPasso);
        break;
      case Direcao.CimaDireita:
        this.irParaCima(passo.tamanhoDoPasso);
        this.irParaDireita(passo.tamanhoDoPasso);
        break;
      case Direcao.Direita:
        this.irParaDireita(passo.tamanhoDoPasso);
        break;
      case Direcao.BaixoDireita:
        this.irParaBaixo(passo.tamanhoDoPasso);
        this.irParaDireita(passo.tamanhoDoPasso);
        break;
      case Direcao.Baixo:
        this.irParaBaixo(passo.tamanhoDoPasso);
        break;
      case Direcao.BaixoEsquerda:
        this.irParaBaixo(passo.tamanhoDoPasso);
        this.irParaEsquerda(passo.tamanhoDoPasso);
        break;
      case Direcao.Esquerda:
        this.irParaEsquerda(passo.tamanhoDoPasso);
        break;
      case Direcao.CimaEsquerda:
        this.irParaCima(passo.tamanhoDoPasso);
        this.irParaEsquerda(passo.tamanhoDoPasso);
        break;
      case undefined:
        break;
      default:
        console.log('Direcao ' + passo?.direcao + ' não mapeada');
        break;
    }
  }

  /**
   *
   * @param direcao É a direção que o passo terá
   * @param tamanhoDoPasso É quantos pixels aquele passo ira mover o walker
   */
  private acrescentarPassos(direcao: Direcao, tamanhoDoPasso: number) {
    this.$passos.push(new Passo(direcao, tamanhoDoPasso));
  }

  /**
   *
   * @param alimento
   *
   * Recebe um alimento e gera um espécie de rota para ele, e coloca os passos em this.$passos
   */
  private passosParaUmAlimento(alimento: Alimento): void {
    let distanciaEixo = 0;
    let qtdPassos = 0;
    if (this.x === alimento.x) {
      qtdPassos = Math.trunc(
        Math.abs(this.y - alimento.y) / this.tamanhoDoPasso
      );
    } else if (this.y === alimento.y) {
      qtdPassos = Math.trunc(
        Math.abs(this.x - alimento.x) / this.tamanhoDoPasso
      );
    } else if (Math.abs(this.x - alimento.x) > Math.abs(this.y - alimento.y)) {
      distanciaEixo = Math.abs(this.y - alimento.y);
    } else {
      distanciaEixo = Math.abs(this.x - alimento.x);
      qtdPassos = Math.trunc(distanciaEixo / this.tamanhoDoPasso);
    }
    if (this.x === alimento.x && this.y < alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Cima, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x < alimento.x && this.y < alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.CimaDireita, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x < alimento.x && this.y === alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Direita, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x < alimento.x && this.y > alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.BaixoDireita, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x === alimento.x && this.y > alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Baixo, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x > alimento.x && this.y > alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.BaixoEsquerda, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x > alimento.x && this.y === alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Esquerda, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x > alimento.x && this.y < alimento.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.CimaEsquerda, this.tamanhoDoPasso);
      }
      return;
    }
  }

  private comer(alimento: Alimento, listaDeAlimentos: Alimento[]): void {
    this.$x = alimento.x;
    this.$y = alimento.y;
    listaDeAlimentos.splice(listaDeAlimentos.indexOf(alimento), 1);
    this.$qtdAlimentoComido++;
    this.$fome += Math.round(alimento.tipo * window.innerHeight * 0.1);
  }

  private alimentoMaisProximo(
    alimentos: Alimento[]
  ): { alimento: Alimento; distancia: number } {
    let alimentoMenorDistancia: { alimento: Alimento; distancia: number };
    let i = 0;
    alimentoMenorDistancia = { alimento: alimentos[0], distancia: Infinity };
    do {
      let alimentoAtual = {
        alimento: alimentos[i],
        distancia: Math.hypot(alimentos[i].x - this.x, alimentos[i].y - this.y),
      };
      if (alimentoAtual.distancia < alimentoMenorDistancia.distancia) {
        alimentoMenorDistancia = alimentoAtual;
      }
      if (Math.round(alimentoAtual.distancia) < this.forcaDeVontade) {
        break;
      }
      i++;
    } while (i < alimentos.length);
    return alimentoMenorDistancia;
  }

  private irParaCima(forca: number) {
    this.$y = Math.min(
      this.y + forca,
      window.innerHeight - (this.tamanho + 20) * 2
    );
  }

  private irParaBaixo(forca: number) {
    this.$y = Math.max(this.y - forca, 0);
  }

  private irParaDireita(forca: number) {
    this.$x = Math.min(
      this.x + forca,
      window.innerWidth - (this.tamanho + 20) * 2
    );
  }

  private irParaEsquerda(forca: number) {
    this.$x = Math.max(this.x - forca, 0);
  }

  //ao usar o andar não há necessidade de retirar o passo, pois ele já retira
  private retirarPasso() {
    this.$passos.shift();
  }

  //retira todos os passos
  private limparPassos() {
    this.$passos = [];
  }
}
