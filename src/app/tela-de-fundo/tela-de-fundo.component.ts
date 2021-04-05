import { Component, OnInit } from '@angular/core';
import { Walker } from '../classes/Walker';
import { Direcao } from '../enums/DirecaoEnum';

@Component({
  selector: 'app-tela-de-fundo',
  templateUrl: './tela-de-fundo.component.html',
  styleUrls: ['./tela-de-fundo.component.scss'],
})
export class TelaDeFundoComponent implements OnInit {
  constructor() {
    this.comecar();
  }

  ngOnInit(): void {}

  private tempoACadaPasso: number = 750; //tempo em milisegundos que cada passo vai acontecer
  private totalWalkers: number = 100;
  public walkers: Walker[] = [];

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  sortearCor(): string {
    let hexadecimais = '0123456789ABCDEF';
    let cor = '#';
    // Pega um número aleatório no array acima
    for (let i = 0; i < 6; i++) {
      //E concatena à variável cor
      cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
  }

  sortearForca(): number {
    return this.getRandomInt(0, 21);
  }

  sortearDirecao(): Direcao {
    let rand: Direcao = this.getRandomInt(1, 9);
    return rand;
  }

  //retorna numeros de -1 a 1 distribuidos "gaussianamente"
  randn_bm() {
    let v = 0;
    let u = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let result = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return result;
  }

  comecar() {
    //Aqui ele cria os walkers
    for (let i = 0; i < this.totalWalkers; i++) {
      this.walkers.push(
        // new Walker(this.randn_bm(), this.randn_bm(), this.sortearCor())
        new Walker(
          this.getRandomInt(0, window.innerWidth - 30),
          this.getRandomInt(0, window.innerHeight - 30),
          this.sortearCor()
        )
      );
    }
    this.loop();
  }

  loop() {
    this.walkers.forEach((cadaUm) => {
      setInterval(() => {
        cadaUm.acrescentarPassos(this.sortearDirecao(), this.sortearForca());
        cadaUm.andar();
      }, this.tempoACadaPasso);
    });
  }

  trocarCorDeFundoEFazerAcao(
    walker: Walker,
    evento: {
      cor: string;
      x: number;
      y: number;
    }
  ) {
    let corAntiga = walker.corDaBorda;
    walker.corDaBorda = evento.cor;
    setTimeout(() => {
      walker.corDaBorda = corAntiga;
    }, 5000);

    //implementar função de repelir ao clicar
    /**
     * Essa função fará os wlakers próximos daquele clicado se repelirem dele
     */
  }

  ruidoDePerlin() {
    var xoff = 0.0;
    for (var x = 0; x < 100; x++) {
      var yoff = 0.0;
      for (var y = 0; y < 50; y++) {
        // var bright = map(noise(xoff, yoff), 0, 1, 0, 255);
        console.log('xoff: ' + xoff + ' yoff: ' + yoff);
        // console.log('x: ' + x + ' y: ' + y);
        yoff += 0.01;
      }
      xoff += 0.01;
    }
  }
  // colocarPassosPraTodos(numeroDePassos: number) {
  //   for (let i = 0; i < numeroDePassos; i++) {
  //     this.walkers.forEach((cadaUm) => {
  //       cadaUm.acrescentarPassos(this.sortearDirecao(), 2);
  //     });
  //   }
  // }
}
