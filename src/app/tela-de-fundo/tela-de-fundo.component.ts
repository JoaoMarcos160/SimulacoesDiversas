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
  getRandomInt,
  sortearSexo,
  sortearLongevidade,
  sortearVelocidadeDeReproducao,
} from '../funcoes/sorteios';

@Component({
  selector: 'app-tela-de-fundo',
  templateUrl: './tela-de-fundo.component.html',
  styleUrls: ['./tela-de-fundo.component.scss'],
})
export class TelaDeFundoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  // private _alimentosGeradosPorVez: number = 50;
  private _alimentosGeradosPorVez: number = this.getParametroRotaNumeroDeIndividuos();
  private _totalAlimentoGerado: number = 0;
  private _timeOut: any;
  private _flagGerarAlimentosX: boolean = true;
  private _flagGerarAlimentosY: boolean = true;

  public walkers: Walker[] = [];
  public tempoEmSegundos: number = 0;
  public tamanhosWalkers: any[] = [];
  public alimentos: Alimento[] = [];
  public dadosCard: Walker | null = null;
  public propriedadesWalker: string[] = [];

  public mostrarTabelas: boolean = true;

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
    return this._totalAlimentoGerado;
  }
  public get sexos(): any[] {
    return calcularQuantidadeArray(
      this.walkers.map((elemento) => {
        return elemento.sexo ? 'Macho' : 'Fêmea';
      }),
      '',
      'Sexo'
    );
  }

  public get causaDaMortePorQuantidade(): any[] {
    return calcularQuantidadeArray(
      this.walkers,
      'causaDaMorte',
      'Causa da Morte'
    );
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
    return 20;
  }

  gerarWalkers() {
    //Aqui ele cria os walkers
    for (let i = 0; i < this.getParametroRotaNumeroDeIndividuos(); i++) {
      this.walkers.push(
        new Walker(
          this.walkers.length + 1,
          Math.trunc(
            Math.min(
              randn_bm() * (this.totalEixoX / 8) + this.totalEixoX / 2,
              this.totalEixoX * 0.95
            )
          ),
          Math.trunc(
            Math.min(
              randn_bm() * (this.totalEixoY / 8) + this.totalEixoY / 2,
              this.totalEixoY * 0.95
            )
          ),
          sortearCorRGB(),
          sortearTamanho(),
          sortearVelocidade(),
          sortearForcaDeVontade(),
          sortearTamanhoDoPasso(),
          sortearSexo(),
          sortearVelocidadeDeReproducao(),
          sortearLongevidade()
        )
      );
    }
  }

  gerarAlimentos() {
    if (this._flagGerarAlimentosX && this._flagGerarAlimentosY) {
      this._flagGerarAlimentosY = false;
    } else if (this._flagGerarAlimentosX && !this._flagGerarAlimentosY) {
      this._flagGerarAlimentosX = false;
      this._flagGerarAlimentosY = false;
    } else if (!this._flagGerarAlimentosX && !this._flagGerarAlimentosY) {
      this._flagGerarAlimentosY = true;
    } else {
      this._flagGerarAlimentosX = true;
      this._flagGerarAlimentosY = true;
    }

    for (let i = 0; i < this._alimentosGeradosPorVez; i++) {
      this.alimentos.push(
        new Alimento(
          this._flagGerarAlimentosX
            ? Math.trunc(
                Math.min(
                  randn_bm() * (this.totalEixoX / 8) + this.totalEixoX / 2,
                  this.totalEixoX * 0.95
                )
              )
            : getRandomInt(50, this.totalEixoX / 2),
          this._flagGerarAlimentosY
            ? Math.trunc(
                Math.min(
                  randn_bm() * (this.totalEixoY / 8) + this.totalEixoY / 2,
                  this.totalEixoY * 0.95
                )
              )
            : getRandomInt(50, this.totalEixoY / 2),
          sortearTipoAlimento()
        )
      );
      this._totalAlimentoGerado++;
    }
  }

  loop() {
    this.gerarAlimentos();
    setInterval(() => {
      this.tempoEmSegundos++;
    }, 1000);
    setInterval(() => {
      if (this.alimentos.length < this.walkers.length * 2)
        this.gerarAlimentos();
    }, 10000);
    this.walkers.forEach((walker) => {
      walker.comecarAndar(this.alimentos, this.walkers);
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

  public atualizarCard(walker: Walker) {
    this.dadosCard = walker;

    clearTimeout(this._timeOut);

    this._timeOut = setTimeout(() => {
      this.dadosCard = null;
    }, 5000);
  }

  public fecharCard() {
    this.dadosCard = null;
  }

  public inverterMostrarTabelas(): void {
    this.mostrarTabelas = !this.mostrarTabelas;
  }

  // colocarPassosPraTodos(numeroDePassos: number) {
  //   for (let i = 0; i < numeroDePassos; i++) {
  //     this.walkers.forEach((cadaUm) => {
  //       cadaUm.acrescentarPassos(this.sortearDirecao(), 2);
  //     });
  //   }
  // }
}
