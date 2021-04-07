import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alimento } from '../classes/Alimento';
import { Walker } from '../classes/Walker';
import { AlimentoTipo } from '../enums/AlimentoTipoEnum';
import { Direcao } from '../enums/DirecaoEnum';
import { calcularQuantidadeArray, sleep } from '../funcoes/core';
import {
  getRandomInt,
  randn_bm,
  sortearTipoAlimento,
  sortearCor,
  sortearTamanho,
} from '../funcoes/sorteios';

@Component({
  selector: 'app-tela-de-fundo',
  templateUrl: './tela-de-fundo.component.html',
  styleUrls: ['./tela-de-fundo.component.scss'],
})
export class TelaDeFundoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  private numeroDeAlimentosGerados: number = 5;

  public get totalWalkers(): number {
    return this.walkers.length;
  }
  public walkers: Walker[] = [];
  public tempoEmSegundos: number = 0;
  public tamanhosWalkers: any[] = [];
  public alimentos: Alimento[] = [];

  ngOnInit(): void {
    this.gerarWalkers();

    this.tamanhosWalkers = calcularQuantidadeArray(
      this.walkers.map((element) => {
        return element.tamanho;
      }),
      '',
      'Tamanho'
    );
    this.gerarAlimentos();
    this.loop();
    // this.calcularVariancias();
    // this.ruidoDePerlin();
  }

  getParametroRotaNumeroDeIndividuos(): number {
    if (this.route.snapshot.params.numeroDeIndividuos) {
      if (
        this.route.snapshot.params.numeroDeIndividuos > 0 &&
        this.route.snapshot.params.numeroDeIndividuos < 5000
      ) {
        return this.route.snapshot.params.numeroDeIndividuos;
      }
    }
    return 5;
  }

  gerarWalkers() {
    //Aqui ele cria os walkers
    for (let i = 0; i < this.getParametroRotaNumeroDeIndividuos(); i++) {
      this.walkers.push(
        new Walker(
          Math.min(
            randn_bm() * (window.innerWidth / 5) + window.innerWidth / 2,
            window.innerWidth * 0.95
          ),
          Math.min(
            randn_bm() * (window.innerHeight / 5) + window.innerHeight / 2,
            window.innerHeight * 0.95
          ),
          sortearCor(),
          sortearTamanho(),
          getRandomInt(20, 1000),
          getRandomInt(1, 50)
        )
      );
    }
  }

  gerarAlimentos() {
    for (let i = 0; i < this.numeroDeAlimentosGerados; i++) {
      this.alimentos.push(
        new Alimento(
          getRandomInt(0, window.innerWidth),
          getRandomInt(0, window.innerHeight),
          sortearTipoAlimento()
        )
      );
    }
  }

  loop() {
    setInterval(() => {
      this.tempoEmSegundos++;
    }, 1000);
    this.walkers.forEach((walker) => {
      walker.comecarAndar(this.alimentos);
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

  async ruidoDePerlin(x = 0.0, y = 0.0, incremento = 0.01) {
    var xoff = x;
    for (var x = 0; x < 100; x++) {
      var yoff = y;
      for (var y = 0; y < 50; y++) {
        // var bright = map(noise(xoff, yoff), 0, 1, 0, 255);
        console.log('xoff: ' + xoff.toFixed(2) + ' yoff: ' + yoff.toFixed(2));
        await sleep(100);
        yoff += incremento;
      }
      xoff += incremento;
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
