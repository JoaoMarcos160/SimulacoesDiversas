//Arquivo com as funções que várias telas e componentes podem usar
export function calcularQuantidadeArray(
  array: any[],
  propriedadeParaSomar = '',
  chave = 'chave',
  ordenar = true
) {
  let arrayQuantidade: { [chave: string]: any; Quantidade: number }[] = [];
  array.forEach((element) => {
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
  });
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

export function calcularCoeficienteAngularDaReta(
  x1: number,
  x2: number,
  y1: number,
  y2: number
): number {
  return (y2 - y1) / (x2 - x1);
}

export function misturarCoresRGB(p: number, c0: string, c1: string) {
  var i = parseInt,
    r = Math.round,
    P = 1 - p,
    [a, b, c, d] = c0.split(','),
    [e, f, g, h] = c1.split(','),
    x = d || h,
    j = x
      ? ',' +
        (!d
          ? h
          : !h
          ? d
          : r((parseFloat(d) * P + parseFloat(h) * p) * 1000) / 1000 + ')')
      : ')';
  return (
    'rgb' +
    (x ? 'a(' : '(') +
    r(
      i(a[3] == 'a' ? a.slice(5) : a.slice(4)) * P +
        i(e[3] == 'a' ? e.slice(5) : e.slice(4)) * p
    ) +
    ',' +
    r(i(b) * P + i(f) * p) +
    ',' +
    r(i(c) * P + i(g) * p) +
    j
  );
}
