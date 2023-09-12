import { Passo } from '../classes/Passo';
import { AlimentoTipo } from '../enums/AlimentoTipoEnum';
import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import { Direcao } from '../enums/DirecaoEnum';

//Arquivo com as funções que sorteiam coisas
/**
 *
 * @param min Número mínimo, é incluído nos possíveis resultados
 * @param max Número máximo, NÃO é incluído nos possíveis resultados
 * @returns Retorna um número inteiro, com base no máximo e mínimo
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 *
 * @param min Número mínimo, é incluído nos possíveis resultados
 * @param max Número máximo, NÃO é incluído nos possíveis resultados
 * @returns Retorna um número float, com base no máximo e mínimo
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function sortearTipoAlimento(): AlimentoTipo {
  return getRandomInt(1, 9);
}

/**
 *
 * @param ultimosPassosDados
 * @returns Sorteia uma direcao tendo como base os ultimos passos dados
 */
export function sortearDirecao(ultimosPassosDados: Passo[]): Direcao {
  if (ultimosPassosDados.length > 0) {
    let ultimo = ultimosPassosDados[ultimosPassosDados.length - 1].direcao;
    let possiveisDirecoes: Direcao[];
    switch (ultimo) {
      case Direcao.Cima:
        possiveisDirecoes = [
          Direcao.Esquerda,
          Direcao.CimaEsquerda,
          Direcao.Cima,
          Direcao.CimaDireita,
          Direcao.Direita,
        ];
        break;
      case Direcao.CimaDireita:
        possiveisDirecoes = [
          Direcao.CimaEsquerda,
          Direcao.Cima,
          Direcao.CimaDireita,
          Direcao.Direita,
          Direcao.BaixoDireita,
        ];
        break;
      case Direcao.Direita:
        possiveisDirecoes = [
          Direcao.Cima,
          Direcao.CimaDireita,
          Direcao.Direita,
          Direcao.BaixoDireita,
          Direcao.Baixo,
        ];
        break;
      case Direcao.BaixoDireita:
        possiveisDirecoes = [
          Direcao.CimaDireita,
          Direcao.Direita,
          Direcao.BaixoDireita,
          Direcao.Baixo,
          Direcao.BaixoEsquerda,
        ];
        break;
      case Direcao.Baixo:
        possiveisDirecoes = [
          Direcao.Direita,
          Direcao.BaixoDireita,
          Direcao.Baixo,
          Direcao.BaixoEsquerda,
          Direcao.Esquerda,
        ];
        break;
      case Direcao.BaixoEsquerda:
        possiveisDirecoes = [
          Direcao.BaixoDireita,
          Direcao.Baixo,
          Direcao.BaixoEsquerda,
          Direcao.Esquerda,
          Direcao.CimaEsquerda,
        ];
        break;
      case Direcao.Esquerda:
        possiveisDirecoes = [
          Direcao.Baixo,
          Direcao.BaixoEsquerda,
          Direcao.Esquerda,
          Direcao.CimaEsquerda,
          Direcao.Cima,
        ];
        break;
      case Direcao.CimaEsquerda:
        possiveisDirecoes = [
          Direcao.BaixoEsquerda,
          Direcao.Esquerda,
          Direcao.CimaEsquerda,
          Direcao.Cima,
          Direcao.CimaDireita,
        ];
        break;
      default:
        possiveisDirecoes = [1, 2, 3, 4, 5, 6, 7, 8]; //todas as direções
        break;
    }
    return possiveisDirecoes[getRandomInt(1, 4)]; // dá um movimento mais linear
    // return possiveisDirecoes[
    //   Math.trunc(Math.random() * possiveisDirecoes.length)
    // ];
  }
  return getRandomInt(1, 9); //todas as direções também
}

/**
 *
 * @returns Retorna um valor de 1 a 10
 */
export function sortearTamanhoDoPasso(): number {
  return 1;
}

/**
 *
 * @returns Sorteia uma cor no formato hexadecimal de 6 caracateres
 */
export function drawHexColor(): string {
  let hexadecimais = '0123456789ABCDEF';
  let cor = '#';
  // Pega um número aleatório no array acima
  // aqui está gerando cores no formato "#ABC" (3 valores apenas)
  for (let i = 0; i < 6; i++) {
    //E concatena à variável cor
    cor += hexadecimais[Math.floor(Math.random() * 16)];
  }
  return cor;
}

/**
 *
 * @returns Retorna uma string de cor no formato RGB, ou seja, rgba(255,255,255,0.5)
 */
export function drawRGBAColor(): string {
  return `rgba(${Math.trunc(Math.random() * 255)},${Math.trunc(
    Math.random() * 255
  )},${Math.trunc(Math.random() * 255)},${Math.random()})`;
}

/**
 *
 * @returns Retorna uma string de cor no formato RGB, ou seja, rgb(255,255,255)
 */
export function drawRGBColor(): string {
  return `rgb(${Math.trunc(Math.random() * 255)},${Math.trunc(
    Math.random() * 255
  )},${Math.trunc(Math.random() * 255)})`;
}

/**
 *
 * @returns Retorna um valor de 20 a 999 que equivale a quantos milisegundos o setInterval
 *  vai receber, ou seja, quanto menor mais rápido
 */
export function sortearVelocidade(): number {
  return getRandomInt(10, 200);
}
/**
 *
 * @returns   Quanto maior o valor mais longe ele estará disposto a ir atrás do alimento,
 * esse é o numero de pixels que ele conseguirá saltar para chegar num alimento
 */
export function sortearForcaDeVontade(): number {
  return getRandomInt(10, 100);
}

/**
 *
 * @returns Equivale ao padding que ele irá receber, é um valor aleatório distribuido "gaussianamente"
 */
export function sortearTamanho(): number {
  let variancia = randn_bm();
  let result = 0;

  if (variancia == 0) {
    result = 0.1 * 0.1 * 2;
  } else {
    result = variancia * variancia * 2;
  }
  if (result == 0) result = 1;
  return Math.trunc(result);
}

/**
 *
 * @returns Retorna um booleano com 50% de chance de ser true e 50% de ser false
 */
export function sortearSexo(): boolean {
  return Math.random() > 0.5;
}

/**
 *
 * @returns Retorna numeros distribuidos "gaussianamente" em torno do 0, podendo ser positivos ou negativos
 */
export function randn_bm() {
  let v = 0;
  let u = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * @returns Retorna quantos ciclos um walker irá viver
 */
export function sortearLongevidade(): number {
  return Math.round(Math.abs(randn_bm()) * 50000);
}

/**
 *
 * @returns Retorna de quantos em quantos ciclos a vontade de reprodução deles aumentará, quanto menor mais rápido
 */
export function sortearVelocidadeDeReproducao(): number {
  return Math.round(Math.abs(randn_bm())) + 5;
}

/**
 *
 * @param contructionType type of contruction
 * @returns width and height for the respective construction
 */
export function drawContructionSize(contructionType: ConstructionTypeEnum): {
  width: number;
  height: number;
} {
  const multiplier = Math.round(Math.abs(randn_bm())) + 5;
  switch (contructionType) {
    case ConstructionTypeEnum.Bush:
      return { width: 16 * multiplier, height: 9 * multiplier };
    case ConstructionTypeEnum.Tree:
      return { width: 12 * multiplier, height: 16 * multiplier };
    case ConstructionTypeEnum.Rock:
      return { width: 10 * multiplier, height: 9 * multiplier };
    case ConstructionTypeEnum.Lake:
      return { width: 12 * multiplier, height: 7 * multiplier };
    default:
      return { width: 1, height: 1 };
  }
}

/**
 *
 * @param constructionType type of contruction
 * @returns max resource for the respective construction
 */
export function maxResourceConstruction(
  size: number,
  constructionType: ConstructionTypeEnum
): number {
  switch (constructionType) {
    case ConstructionTypeEnum.Lake:
      return getRandomInt(size * 10, size * 15);
    case ConstructionTypeEnum.Bush:
      return getRandomInt(size * 5, size * 10);
    case ConstructionTypeEnum.Tree:
      return getRandomInt(size * 10, size * 15);
    case ConstructionTypeEnum.Rock:
      return getRandomInt(size * 5, size * 10);
    default:
      return getRandomInt(size * 2, size * 4);
  }
}

/**
 *
 * @param contructionType type of contruction
 * @returns resource rate for the respective construction
 */
export function drawResourceRate(
  contructionType: ConstructionTypeEnum
): number {
  console.log(contructionType);
  return Math.abs(randn_bm());
}
