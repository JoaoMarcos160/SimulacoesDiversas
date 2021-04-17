import { CausaDaMorte } from '../enums/CausaDaMorteEnum';
import { Direcao } from '../enums/DirecaoEnum';
import { StatusWalker } from '../enums/StatusWalker';
import { misturarCoresRGB } from '../funcoes/core';
import {
  getRandomInt,
  randn_bm,
  sortearDirecao,
  sortearSexo,
} from '../funcoes/sorteios';
import { Alimento } from './Alimento';
import { Passo } from './Passo';

/**
 * Informações Sobre:
 * Força de Vontade:
 * A força de vontade defini o quão perto eles precisam estar de um alimento pra saltar pra ele
 * A força de vontade maior eles estrão dispostos a ir mais longe em busca de algo
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
  private static alimentos: Alimento[];
  private static walkers: Walker[];
  private static walkersMortos: Walker[];

  private _id: number = 0;
  private _x: number = 0;
  private _y: number = 0;
  private _passos: Passo[] = [];
  private _ultimosPassosDados: Passo[] = [];
  private _qtdAlimentoComido: number = 0;
  private _numeroDeCiclos: number = 0;
  private _alimentacao: number = 1000;
  private _sexo: boolean = true;
  private _velocidadeReproducao: number = 0;
  private _vontadeDeReproducao: number = 0;
  private _longevidade: number = 0;
  private _causaDaMorte: CausaDaMorte | null = null;
  private _alimentoSendoBuscado: Alimento | null = null;
  private _parceiroSendoBuscado: Walker | null = null;
  private _status: StatusWalker = StatusWalker.ProcurandoComida;
  private _multiplicadorDeVelocidade: number = 1;
  private _corInicial: string = 'rgb(0,0,0)';

  /**
   * Tempo em milisegundos para ele andar, quanto mais alto mais lento
   */
  private _velocidade: number = 750;

  private _interval: any = 0;

  //Propriedades públicas
  /**
   * Cor do padding do walker
   */
  public corDaBorda: string = 'rgb(0,0,0)';
  /**
   * Quantos pixels terá o padding do walker
   */
  public tamanho: number = 0;

  /**
   *  Numeros de pixels que ele estará disposto para pular em um alimento
   */
  public forcaDeVontade: number = 1;
  /**
   * Quantos pixels ele anda por vez
   * */
  public tamanhoDoPasso: number = 1;

  //Getters
  /**
   * Id de um walker
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Coordenada X que o walker está
   */
  public get x(): number {
    return this._x;
  }
  /**
   * Coordenada Y que o walker está
   */
  public get y(): number {
    return this._y;
  }

  /**
   * Coordenada x que o walker está
   */
  public get qtdAlimentoComido(): number {
    return this._qtdAlimentoComido;
  }

  /**
   * Número de ciclos que o walker já completou, equivale a idade dele
   */
  public get numeroDeCiclos(): number {
    return this._numeroDeCiclos;
  }

  /**
   * Nível de alimentação que o walker se encontra, o walker começa com nível 1000, e vai abaixando 1 a cada passo que ele dá
   */
  public get alimentacao(): number {
    return this._alimentacao;
  }

  /**
   * Ultimo passo dado pelo walker
   */
  public get ultimoPasso(): Passo {
    return this._ultimosPassosDados[this._ultimosPassosDados.length - 1];
  }

  /**
   * Quantidade de passos que o walker ainda tem armazenado para andar para alguma posição
   */
  public get passosArmazenados(): number {
    return this._passos.length;
  }

  /**
   * Sexo do walker, podendo ser True para Macho e False para Fêmea
   */
  public get sexo(): boolean {
    return this._sexo;
  }

  /**
   * Nível de vontade que o walker está de se reproduzir
   */
  public get vontadeDeReproducao(): number {
    return this._vontadeDeReproducao;
  }

  /**
   * Indica se o walker está pronto para reprodução
   */
  public get prontoParaReproduzir(): boolean {
    return this.vontadeDeReproducao >= 500 && this.alimentacao > 1000;
    // return this.vontadeDeReproducao >= 1000 && this.alimentacao > 1000;
  }

  /**
   * Quanto maior o número mais rápido será a velocidade do walker
   */
  public get multiplicadorDeVelocidade() {
    return this._multiplicadorDeVelocidade;
  }

  /**
   * Trata para ser um valor entre 1 e 5
   */
  public set multiplicadorDeVelocidade(novoValor) {
    clearInterval(this._interval);
    this.comecarAndar();
    this._multiplicadorDeVelocidade = Math.min(Math.max(novoValor, 1), 5);
  }

  public get velocidade(): number {
    return this._velocidade / this.multiplicadorDeVelocidade;
  }
  /**
   * De quanto em quantos ciclos sua vontade de se reproduzir aumentará, quanto mais alto o numero mais lentamente
   */
  public get velocidadeReproducao(): number {
    return this._velocidadeReproducao;
  }

  /**
   * Guarda qual foi a causa da morte do walker
   */
  public get causaDaMorte(): string {
    if (this._causaDaMorte == null) {
      return 'Ainda vivo';
    }
    return ['Velhice', 'Fome'][this._causaDaMorte];
  }

  /**
   * Número de ciclos para a morte do walker, mais longevidade siginifica uma mais ciclos até a morte
   */
  public get longevidade(): number {
    return this._longevidade;
  }
  /**
   * O que o walker está fazendo no momento
   */
  public get status(): string {
    return [
      'Procurando comida',
      'Indo até o alimento',
      'Indo até o parceiro',
      'Morto',
    ][this._status];
  }

  /**
   * Retorna qual foi a cor atribuida inicialmente pro walker
   */
  public get corInicial(): string {
    return this._corInicial;
  }

  //Fim dos Getters

  constructor(
    id: number,
    width: number,
    height: number,
    corDaBorda = 'rgb(0,0,0)',
    tamanho: number,
    velocidade: number,
    forcaDeVontade: number,
    tamanhoDoPasso: number,
    sexo: boolean,
    velocidadeDeReproducao: number,
    longevidade: number,
    alimentos: Alimento[],
    walkers: Walker[],
    walkerMortos: Walker[]
  ) {
    Walker.alimentos = alimentos;
    Walker.walkers = walkers;
    Walker.walkersMortos = walkerMortos;
    this._id = id;
    this._x = Math.max(width, 0);
    this._y = Math.max(height, 0);
    this.corDaBorda = corDaBorda;
    this._corInicial = corDaBorda;
    this.tamanho = tamanho;
    this._velocidade = velocidade;
    this.forcaDeVontade = forcaDeVontade;
    this.tamanhoDoPasso = tamanhoDoPasso;
    this._sexo = sexo;
    this._velocidadeReproducao = velocidadeDeReproducao;
    this._longevidade = longevidade;
  }

  /**
   *
   * @param alimentos Lista de alimentos disponíveis
   *
   * @returns Faz o walker começar a andar colocando ele num loop de setInterval que se repete na sua velocidade
   */
  comecarAndar() {
    this._interval = setInterval(() => {
      if (this.passosArmazenados === 0) {
        if (this.prontoParaReproduzir) {
          //fêmeas ficam paradas
          if (!this.sexo) {
            this.acrescentarPassos(Direcao.Cima, 0);
            this._status = StatusWalker.IndoAteParceiro;
          } else {
            let retornoWalker = this.encontrarParceiroMaisProximo(
              Walker.walkers
            );
            if (retornoWalker) {
              if (
                Math.round(retornoWalker.distancia) <
                this.forcaDeVontade * 5
              ) {
                this._x = retornoWalker.walker.x;
                this._y = retornoWalker.walker.y;
                //acasalamento aqui
                //dança do acasalamento
                let flag = true;
                for (let i = 0; i < 20; i++) {
                  if (flag) {
                    flag = !flag;
                    this.acrescentarPassos(Direcao.Direita, 20);
                  } else {
                    flag = !flag;
                    this.acrescentarPassos(Direcao.Esquerda, 20);
                  }
                }
                this.acasalar(retornoWalker.walker);
              }
              this._parceiroSendoBuscado = retornoWalker.walker;
              console.log(
                this.id +
                  ' encontrou como parceiro a ' +
                  retornoWalker.walker.id
              );

              this.passosParaUmaCoordenada({
                x: retornoWalker.walker.x,
                y: retornoWalker.walker.y,
              });
              this._status = StatusWalker.IndoAteParceiro;
            } else {
              //caso não encontre nenhum parceiro
              this.acrescentarPassos(
                sortearDirecao(this._ultimosPassosDados),
                this.tamanhoDoPasso
              );
              this._status = StatusWalker.ProcurandoComida;
            }
          }
        } else if (Walker.alimentos.length > 0) {
          let retornoAlimento = this.alimentoMaisProximo(Walker.alimentos);
          //se o alimento estiver muito perto ele já pula no alimento e come
          if (Math.round(retornoAlimento.distancia) < this.forcaDeVontade / 2) {
            //ele pula até o alimento
            this.comer(retornoAlimento.alimento, Walker.alimentos);
          }
          //isso aqui faz eles não irem atrás de alimentos muito longe
          if (retornoAlimento.distancia < this.forcaDeVontade * 8) {
            this._alimentoSendoBuscado = retornoAlimento.alimento;
            this.passosParaUmaCoordenada({
              x: retornoAlimento.alimento.x,
              y: retornoAlimento.alimento.y,
            });
            this._status = StatusWalker.IndoAteAlimento;
          } else {
            //caso o alimento encontrado mais próximo ainda esteja muito longe pra força de vontade dele ele anda aleatoriamente
            this.acrescentarPassos(
              sortearDirecao(this._ultimosPassosDados),
              this.tamanhoDoPasso
            );
            this._status = StatusWalker.ProcurandoComida;
          }
        } else {
          //caso eles não estejam prontos pra reproduzir e nem tem aliemntos disponíveis eles andam aleatoriamente
          this.acrescentarPassos(
            sortearDirecao(this._ultimosPassosDados),
            this.tamanhoDoPasso
          );
          this._status = StatusWalker.ProcurandoComida;
        }
      } else {
        //valida se o alimento que eles estão indo atrás ainda existe, ou seja, nenhum outro cmeu antes deles
        //isso tambpem faz que eles não fiquem indo em coordenadas que os alimentos nem existem mais
        if (
          this._status === StatusWalker.IndoAteAlimento &&
          !this.alimentoBuscadoAindaExiste(Walker.alimentos)
        ) {
          this.limparPassos();
          this._status = StatusWalker.ProcurandoComida;
        }
        if (
          this._status === StatusWalker.IndoAteParceiro &&
          !this.parceiroBuscadoAindaExiste(Walker.walkers)
        ) {
          this.limparPassos();
          this._status = StatusWalker.ProcurandoComida;
        }
      }

      if (this._numeroDeCiclos % 10 === 0) {
        this.corDaBorda = misturarCoresRGB(
          parseFloat((1 / this.velocidade).toFixed(3)),
          this.corDaBorda,
          'rgb(255,255,255)'
        );
      }
      this.andar();
      this._alimentacao--;
      //validações de possíveis Causas de morte
      if (this._numeroDeCiclos % this.velocidadeReproducao == 0) {
        this._vontadeDeReproducao = Math.min(
          1000,
          this.vontadeDeReproducao + 1
        );
      }
      if (this.numeroDeCiclos > this.longevidade) {
        this._causaDaMorte = CausaDaMorte.Velhice;
        this.corDaBorda = 'rgb(221,217,206)';
      }
      if (this.alimentacao <= 0) {
        this._causaDaMorte = CausaDaMorte.Fome;
        this.corDaBorda = 'rgb(255,255,0)';
      }
      //se houve uma causa da morte ele para de repetir ciclos
      if (this.causaDaMorte !== 'Ainda vivo') {
        console.log('Walker ' + this.id + ' morreu!');
        this._status = StatusWalker.Morto;
        clearInterval(this._interval);
        setTimeout(() => {
          this.retirarWalkerDoMapa();
        }, 10000);
      }
      this._numeroDeCiclos++;
    }, this.velocidade);
  }

  /**
   *
   * @param passo
   * Recebe o ultimo passo dado e coloca no fim de this.$ultimosPassosDados
   */
  private acrescentarUltimoPassoDado(passo: Passo) {
    if (this._ultimosPassosDados.length > 5) {
      this._ultimosPassosDados.shift();
    }
    this._ultimosPassosDados.push(passo);
  }

  /**
   * Executa o primeiro passo que estiver no array this.$passos e joga o passo para this.$ultimosPassosDados
   */
  private andar() {
    let passo = this._passos.shift();
    if (passo != undefined) {
      this.acrescentarUltimoPassoDado(passo);
      switch (passo.direcao) {
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
          console.log('Direcao ' + passo.direcao + ' não mapeada');
          break;
      }
    }
  }

  /**
   *
   * @param direcao É a direção que o passo terá
   * @param tamanhoDoPasso É quantos pixels aquele passo ira mover o walker
   */
  private acrescentarPassos(direcao: Direcao, tamanhoDoPasso: number) {
    this._passos.push(new Passo(direcao, tamanhoDoPasso));
  }

  /**
   *
   * @param coordenada
   *
   * Recebe um alimento e gera um espécie de rota para ele, e coloca os passos em this.$passos
   */
  private passosParaUmaCoordenada(coordenada: { x: number; y: number }): void {
    let distanciaEixo = 0;
    let qtdPassos = 0;
    if (this.x === coordenada.x) {
      qtdPassos = Math.trunc(
        Math.abs(this.y - coordenada.y) / this.tamanhoDoPasso
      );
    } else if (this.y === coordenada.y) {
      qtdPassos = Math.trunc(
        Math.abs(this.x - coordenada.x) / this.tamanhoDoPasso
      );
    } else if (
      Math.abs(this.x - coordenada.x) > Math.abs(this.y - coordenada.y)
    ) {
      distanciaEixo = Math.abs(this.y - coordenada.y);
      qtdPassos = Math.trunc(distanciaEixo / this.tamanhoDoPasso);
    } else {
      distanciaEixo = Math.abs(this.x - coordenada.x);
      qtdPassos = Math.trunc(distanciaEixo / this.tamanhoDoPasso);
    }
    if (this.x === coordenada.x && this.y < coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Cima, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x < coordenada.x && this.y < coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.CimaDireita, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x < coordenada.x && this.y === coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Direita, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x < coordenada.x && this.y > coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.BaixoDireita, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x === coordenada.x && this.y > coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Baixo, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x > coordenada.x && this.y > coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.BaixoEsquerda, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x > coordenada.x && this.y === coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.Esquerda, this.tamanhoDoPasso);
      }
      return;
    }
    if (this.x > coordenada.x && this.y < coordenada.y) {
      for (let i = 0; i < qtdPassos; i++) {
        this.acrescentarPassos(Direcao.CimaEsquerda, this.tamanhoDoPasso);
      }
      return;
    }
  }

  private comer(alimento: Alimento, listaDeAlimentos: Alimento[]): void {
    this._x = alimento.x;
    this._y = alimento.y;
    listaDeAlimentos.splice(listaDeAlimentos.indexOf(alimento), 1);
    this._qtdAlimentoComido++;
    this._alimentacao += Math.round(
      alimento.tipo * Math.max(window.innerHeight, window.innerWidth) * 0.1
    );
  }

  /**
   *
   * @param alimentos Lista de alimentos dísponíveis
   * @returns Retorna um alimento perto o suficiente para ir buscá-lo
   */
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
      //esse if aqui garante que ele traga um alimento perto o suficiente e evite de buscar em varrer em todos os alimentos
      if (Math.round(alimentoAtual.distancia) < this.forcaDeVontade) {
        break;
      }
      i++;
    } while (i < alimentos.length);
    return alimentoMenorDistancia;
  }

  private irParaCima(forca: number) {
    this._y = Math.min(
      this.y + forca,
      window.innerHeight - (this.tamanho + 20) * 2
    );
  }

  private irParaBaixo(forca: number) {
    this._y = Math.max(this.y - forca, 0);
  }

  private irParaDireita(forca: number) {
    this._x = Math.min(
      this.x + forca,
      window.innerWidth - (this.tamanho + 20) * 2
    );
  }

  private irParaEsquerda(forca: number) {
    this._x = Math.max(this.x - forca, 0);
  }

  //retira todos os passos
  private limparPassos() {
    this._passos = [];
  }

  /**
   *
   * @param walkers Recebe a lista de walkers disponíveis
   * @returns Retorna o parceira do sexo oposto pronto para reprodução mais próximo
   */
  private encontrarParceiroMaisProximo(
    walkers: Walker[]
  ): { walker: Walker; distancia: number } | null {
    let possiveisParceiros: { walker: Walker; distancia: number }[] = [];
    for (let i = 0; i < walkers.length; i++) {
      const walker = walkers[i];
      const distancia = Math.hypot(
        walkers[i].x - this.x,
        walkers[i].y - this.y
      );

      if (
        walker.sexo !== this.sexo &&
        walker.prontoParaReproduzir &&
        walker._causaDaMorte == null
      ) {
        possiveisParceiros.push({ walker: walker, distancia: distancia });
        if (distancia < this.forcaDeVontade) {
          break;
        }
      }
    }
    if (possiveisParceiros.length > 0) {
      possiveisParceiros.sort((a, b) => {
        return a.distancia - b.distancia;
      });
      return possiveisParceiros[0];
    }
    return null;
  }

  /**
   *
   * @param alimentos Lista de alimentos disponíveis
   * @returns Retorna se o alimento ainda existe ou não
   */
  private alimentoBuscadoAindaExiste(alimentos: Alimento[]): boolean {
    if (this._alimentoSendoBuscado != null) {
      return alimentos.includes(this._alimentoSendoBuscado);
    }
    return false;
  }

  /**
   *
   * @param walkers Lista de walkers disponíveis
   * @returns Retorna se o walker ainda está pronto para reprodução ou não
   */
  private parceiroBuscadoAindaExiste(walkers: Walker[]): boolean {
    if (this._parceiroSendoBuscado != null) {
      for (let i = 0; i < walkers.length; i++) {
        const element = walkers[i];
        if (element.id === this._parceiroSendoBuscado.id) {
          if (element.prontoParaReproduzir && element.causaDaMorte == null) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Quem acasala é sempre o macho, eles são quase como cavalos marinhos
   * Eles podem ter 1 ou mais filhos (mas a grande maioria terá apenas 1 por vez)
   * @param parceiro Recebe com qual walker ele vai partilhar os genes
   */
  private acasalar(parceiro: Walker): void {
    //perde alimentação ao se reproduzir
    this._alimentacao -= Math.round(
      Math.max(window.innerHeight, window.innerWidth) * 0.1
    );
    // sua vontade de se reproduzir vai pra zero após o acasalamento
    this._vontadeDeReproducao = 0;

    let quantidadeDeFilhos = Math.abs(randn_bm());
    console.log(
      'Número de filhos entre ' +
        this.id +
        ' e ' +
        parceiro.id +
        ': ' +
        quantidadeDeFilhos
    );
    for (let i = 0; i < quantidadeDeFilhos; i++) {
      Walker.walkers.push(
        new Walker(
          Walker.walkers.length + 1,
          this.x,
          this.y,
          misturarCoresRGB(0.5, this.corInicial, parceiro.corInicial),
          getRandomInt(
            Math.min(this.tamanho + parceiro.tamanho),
            Math.max(this.tamanho + parceiro.tamanho)
          ),
          getRandomInt(
            Math.min(this._velocidade + parceiro._velocidade),
            Math.max(this._velocidade + parceiro._velocidade)
          ),
          getRandomInt(
            Math.min(this.forcaDeVontade + parceiro.forcaDeVontade),
            Math.max(this.forcaDeVontade + parceiro.forcaDeVontade)
          ),
          getRandomInt(
            Math.min(this.tamanhoDoPasso + parceiro.tamanhoDoPasso),
            Math.max(this.tamanhoDoPasso + parceiro.tamanhoDoPasso)
          ),
          sortearSexo(),
          getRandomInt(
            Math.min(this.velocidadeReproducao + parceiro.velocidadeReproducao),
            Math.max(this.velocidadeReproducao + parceiro.velocidadeReproducao)
          ),
          getRandomInt(
            Math.min(this.longevidade + parceiro.longevidade),
            Math.max(this.longevidade + parceiro.longevidade)
          ),
          Walker.alimentos,
          Walker.walkers,
          Walker.walkersMortos
        )
      );
      Walker.walkers[Walker.walkers.length - 1].comecarAndar();
    }
  }

  /**
   * Para o walker
   */
  public paraDeAndar(): void {
    clearInterval(this._interval);
  }

  private retirarWalkerDoMapa() {
    Walker.walkersMortos.push(
      Walker.walkers.splice(Walker.walkers.indexOf(this), 1)[0]
    );
  }
}
