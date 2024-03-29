//Arquivo com as funções que várias telas e componentes podem usar
export function calcularQuantidadeArray(
  array: any[],
  propriedadeParaSomar = '',
  chave = 'chave',
  ordenar = true
) {
  let arrayQuantidade: { [chave: string]: any; Quantidade: number }[] = [];
  for (const element of array) {
    if (element[propriedadeParaSomar] != null) {
      arrayQuantidade.push({
        [chave]: element[propriedadeParaSomar],
        Quantidade: array.filter(
          (valorBuscado) =>
            valorBuscado[propriedadeParaSomar] == element[propriedadeParaSomar]
        ).length,
      });
    } else {
      arrayQuantidade.push({
        [chave]: element,
        Quantidade: array.filter((valorBuscado) => valorBuscado == element)
          .length,
      });
    }
  }
  //tirando elementos repetidos
  let dicionario: { [chave: string]: any; Quantidade: number }[] = [];
  arrayQuantidade.forEach((element, index) => {
    dicionario[element[chave]] = arrayQuantidade[index];
  });
  let arrayDicionario: { [chave: string]: any; Quantidade: number }[] = [];
  for (var key in dicionario) {
    arrayDicionario.push({
      [chave]: key,
      Quantidade:
        arrayQuantidade[
          arrayQuantidade.findIndex((chave2) => {
            return chave2[chave] == key;
          })
        ].Quantidade,
    });
  }

  if (ordenar) {
    arrayDicionario.sort((a, b) => {
      return a.variancia - b.variancia;
    });
  }
  return arrayDicionario;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * @param p quanto a primeira cor vai receber da segunda cor (de 0 a 1)
 * @param c0 primeira cor em RGB ou RGBA
 * @param c1 segunda cor em RGB ou RGBA
 * @returns retorna a mistura das cores
 */
export function mixColorsRGB(p: number, c0: string, c1: string) {
  const P = 1 - p,
    [cor1, cor2, cor3, alpha1] = c0.split(','),
    [cor4, cor5, cor6, alpha2] = c1.split(','),
    x = alpha1 || alpha2,
    j = x
      ? ',' +
        (!alpha1
          ? alpha2
          : !alpha2
          ? alpha1
          : Math.abs(
              Math.round(
                (parseFloat(alpha1) * P + parseFloat(alpha2) * p) * 1000
              )
            ) /
              1000 +
            ')')
      : ')';
  return (
    'rgb' +
    (x ? 'a(' : '(') +
    Math.min(
      255,
      Math.abs(
        Math.round(
          parseInt(cor1[3] == 'a' ? cor1.slice(5) : cor1.slice(4)) * P +
            parseInt(cor4[3] == 'a' ? cor4.slice(5) : cor4.slice(4)) * p
        )
      )
    ) +
    ',' +
    Math.min(
      255,
      Math.abs(Math.round(parseInt(cor2) * P + parseInt(cor5) * p))
    ) +
    ',' +
    Math.min(
      255,
      Math.abs(Math.round(parseInt(cor3) * P + parseInt(cor6) * p))
    ) +
    j
  );
}

const RGB_REGEX = /^rgb\((\d+),(\d+),(\d+)\)$/;

/**
 *
 * @param rgbString string no formato rgb(255,255,255)
 * @param alfa numero de alfa (transparencia) de 0 a 1
 * @returns nova string no formato rgba(255,255,255,0.5)
 */
export function addTransparencyToRGB(
  rgbString: string,
  alfa: number = 0.5
): string | null {
  const match = RGB_REGEX.exec(rgbString);

  if (!match) {
    return null;
  }

  const [, r, g, b] = match;

  return `rgba(${r},${g},${b},${alfa})`;
}
