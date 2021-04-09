import { Passo } from '../classes/Passo';
import { AlimentoTipo } from '../enums/AlimentoTipoEnum';
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

export function sortearTamanhoDoPasso(): number {
  return getRandomInt(1, 11);
}

export function sortearCorHex(): string {
  let hexadecimais = '0123456789ABCDEF';
  let cor = '#';
  // Pega um número aleatório no array acima
  // aqui está gerando cores no formato "#ABC" (3 valores apenas)
  for (let i = 0; i < 3; i++) {
    //E concatena à variável cor
    cor += hexadecimais[Math.floor(Math.random() * 16)];
  }
  return cor;
}

export function sortearCorRGBA(): string {
  return `rgba(${Math.trunc(Math.random() * 255)}, ${Math.trunc(
    Math.random() * 255
  )}, ${Math.trunc(Math.random() * 255)}, ${Math.random()})`;
}

export function sortearCorRGB(): string {
  return `rgb(${Math.trunc(Math.random() * 255)}, ${Math.trunc(
    Math.random() * 255
  )}, ${Math.trunc(Math.random() * 255)})`;
}

export function sortearVelocidade(): number {
  //quanto menor o valor mais rápido
  return getRandomInt(20, 1000);
}

export function sortearForcaDeVontade(): number {
  //quanto maior o valor mais longe ele estará disposto a ir atrás do alimento
  //esse é o numero de pixels que ele conseguirá saltar para chegar num alimento
  return getRandomInt(10, 100);
}

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

//retorna numeros distribuidos "gaussianamente" em torno do 0
export function randn_bm() {
  let v = 0;
  let u = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let result = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return result;
}
