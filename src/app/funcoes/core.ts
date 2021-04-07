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

//falta calcular como andar só um pedaço numa reta tendo as coordenadas do ponto cartesiano
