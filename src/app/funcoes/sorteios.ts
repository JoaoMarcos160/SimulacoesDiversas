import { Passo } from '../classes/Passo';
import { AlimentoTipo } from '../enums/AlimentoTipoEnum';
import { Direcao } from '../enums/DirecaoEnum';

//Arquivo com as funções que sorteiam coisas

export function getRandomInt(min: number, max: number) {
  //o numero máximo não é incluso, o numero minimo é
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function sortearTipoAlimento(): AlimentoTipo {
  return getRandomInt(1, 9);
}

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
    return possiveisDirecoes[
      Math.floor(Math.random() * possiveisDirecoes.length)
    ];
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
  return `rgba(${parseInt((Math.random() * 255).toString())}, ${parseInt(
    (Math.random() * 255).toString()
  )}, ${parseInt((Math.random() * 255).toString())}, ${Math.random()})`;
}

export function sortearCorRGB(): string {
  return `rgb(${parseInt((Math.random() * 255).toString())}, ${parseInt(
    (Math.random() * 255).toString()
  )}, ${parseInt((Math.random() * 255).toString())})`;
}

export function sortearVelocidade(): number {
  //quanto menor o valor mais rápido
  return getRandomInt(20, 1000);
}

export function sortearForcaDeVontade(): number {
  //quanto maior o valor mais longe ele estará disposto a ir atrás do alimento
  return getRandomInt(1, 11);
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
  return parseInt(result.toString());
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
