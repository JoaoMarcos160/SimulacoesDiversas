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
  return getRandomInt(1, 5);
}

export function sortearDirecao(): Direcao {
  return getRandomInt(1, 9);
}

export function sortearTamanhoDoPasso(): number {
  return getRandomInt(0, 21);
}

export function sortearCor(): string {
  let hexadecimais = '0123456789ABCDEF';
  let cor = '#';
  // Pega um número aleatório no array acima
  for (let i = 0; i < 6; i++) {
    //E concatena à variável cor
    cor += hexadecimais[Math.floor(Math.random() * 16)];
  }
  return cor;
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
