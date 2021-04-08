import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alimento } from '../classes/Alimento';
import { Walker } from '../classes/Walker';
import { calcularQuantidadeArray, sleep } from '../funcoes/core';
import {
  randn_bm,
  sortearTipoAlimento,
  sortearTamanho,
  sortearTamanhoDoPasso,
  sortearVelocidade,
  sortearForcaDeVontade,
  sortearCorRGB,
} from '../funcoes/sorteios';

@Component({
  selector: 'app-tela-de-fundo',
  templateUrl: './tela-de-fundo.component.html',
  styleUrls: ['./tela-de-fundo.component.scss'],
})
export class TelaDeFundoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  private $alimentosGeradosPorVez: number = this.getParametroRotaNumeroDeIndividuos();
  private $totalAlimentoGerado: number = 0;
  private $timeOut: any;

  public walkers: Walker[] = [];
  public tempoEmSegundos: number = 0;
  public tamanhosWalkers: any[] = [];
  public alimentos: Alimento[] = [];
  public dadosCard: Walker | null = null;

  public get totalWalkers(): number {
    return this.walkers.length;
  }
  public get totalEixoX(): number {
    return window.innerWidth;
  }
  public get totalEixoY(): number {
    return window.innerHeight;
  }
  public get totalAlimentoGerado(): number {
    return this.$totalAlimentoGerado;
  }

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
    return 10;
  }

  gerarWalkers() {
    //Aqui ele cria os walkers
    for (let i = 0; i < this.getParametroRotaNumeroDeIndividuos(); i++) {
      this.walkers.push(
        new Walker(
          this.walkers.length + 1,
          parseInt(
            Math.min(
              randn_bm() * (this.totalEixoX / 8) + this.totalEixoX / 2,
              this.totalEixoX * 0.95
            ).toString()
          ),
          parseInt(
            Math.min(
              randn_bm() * (this.totalEixoY / 8) + this.totalEixoY / 2,
              this.totalEixoY * 0.95
            ).toString()
          ),
          sortearCorRGB(),
          sortearTamanho(),
          sortearVelocidade(),
          sortearForcaDeVontade(),
          sortearTamanhoDoPasso()
        )
      );
    }
  }

  gerarAlimentos() {
    for (let i = 0; i < this.$alimentosGeradosPorVez; i++) {
      this.alimentos.push(
        new Alimento(
          parseInt(
            Math.min(
              randn_bm() * (this.totalEixoX / 8) + this.totalEixoX / 2,
              this.totalEixoX * 0.95
            ).toString()
          ),
          parseInt(
            Math.min(
              randn_bm() * (this.totalEixoY / 8) + this.totalEixoY / 2,
              this.totalEixoY * 0.95
            ).toString()
          ),
          sortearTipoAlimento()
        )
      );
      this.$totalAlimentoGerado++;
    }
  }

  loop() {
    setInterval(() => {
      this.tempoEmSegundos++;
    }, 1000);
    setInterval(() => {
      this.gerarAlimentos();
    }, 5000);
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

  atualizarCard(walker: Walker) {
    this.dadosCard = walker;

    clearTimeout(this.$timeOut);

    this.$timeOut = setTimeout(() => {
      this.dadosCard = null;
    }, 5000);
  }

  // colocarPassosPraTodos(numeroDePassos: number) {
  //   for (let i = 0; i < numeroDePassos; i++) {
  //     this.walkers.forEach((cadaUm) => {
  //       cadaUm.acrescentarPassos(this.sortearDirecao(), 2);
  //     });
  //   }
  // }
}
