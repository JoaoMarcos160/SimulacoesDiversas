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
  selector: 'app-simulacao-inicial',
  templateUrl: './simulacao-inicial.component.html',
  styleUrls: ['./simulacao-inicial.component.scss'],
})
export class SimulacaoInicialComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  public alimentosGeradosPorVez: number = this.getParametroRotaNumeroDeIndividuos();
  private _totalAlimentoGerado: number = 0;
  private _timeOut: any;
  private _flagGerarAlimentosX: boolean = true;
  private _flagGerarAlimentosY: boolean = true;

  private _intervalAlimento: any;

  public walkers: Walker[] = [];
  public walkersMortos: Walker[] = [];
  public tempoEmSegundos: number = 0;
  public alimentos: Alimento[] = [];
  public dadosCard: Walker | null = null;
  public propriedadesWalker: string[] = [];
  public velocidadeSimulacao: number = 1;
  public multiplicadorDeVelocidade: number = 1;

  public mostrarTabelas: boolean = true;
  public mostrarConfiguracoes: boolean = true;
  public mostrarId: boolean = true;
  public usarDarkMode: boolean = false;
  public propriedadeSelecionada: { chave: string; valor: string } = {
    chave: 'Velocidade',
    valor: 'velocidade',
  };
  public propriedadesPossiveis: { chave: string; valor: string }[] = [
    { chave: 'Cor da Borda', valor: 'corDaBorda' },
    { chave: 'Cor Inicial', valor: 'corInicial' },
    { chave: 'Tamanho', valor: 'tamanho' },
    { chave: 'Força de vontade', valor: 'forcaDeVontade' },
    { chave: 'Tamanho do passo', valor: 'tamanhoDoPasso' },
    { chave: 'Coordenada X', valor: 'x' },
    { chave: 'Coordenada Y', valor: 'y' },
    { chave: 'Quantidade alimento comido', valor: 'qtdAlimentoComido' },
    { chave: 'Número de ciclos', valor: 'numeroDeCiclos' },
    { chave: 'Alimentação', valor: 'alimentacao' },
    { chave: 'Último passo', valor: 'ultimoPasso' },
    { chave: 'Quantidade de passos armazenados', valor: 'passosArmazenados' },
    { chave: 'Sexo', valor: 'sexoString' },
    { chave: 'Vontade de reprodução', valor: 'vontadeDeReproducao' },
    { chave: 'Pronto para se reproduzir', valor: 'prontoParaReproduzir' },
    {
      chave: 'Multiplicador de velocidade',
      valor: 'multiplicadorDeVelocidade',
    },
    { chave: 'Velocidade', valor: 'velocidade' },
    { chave: 'Velocidade de reprodução', valor: 'velocidadeReproducao' },
    { chave: 'Causa da Morte', valor: 'causaDaMorte' },
    { chave: 'Longevidade', valor: 'longevidade' },
    { chave: 'Status', valor: 'status' },
    { chave: 'Número de filhos', valor: 'numeroDeFilhos' },
    { chave: 'Tipo de alimento preferido', valor: 'tipoAlimentoPreferidoString' },
  ];

  public get totalWalkersQueJaExixtiram(): number {
    return this.walkers.length + this.walkersMortos.length;
  }

  public get totalWalkersVivos(): number {
    return this.walkers.length;
  }

  public get totalWalkerMortos(): number {
    return this.walkersMortos.length;
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

  public get tamanhosWalkers(): any[] {
    return calcularQuantidadeArray(
      this.walkers.map((element) => {
        return element.tamanho;
      }),
      '',
      'Tamanho'
    );
  }

  public get sexos(): any[] {
    return calcularQuantidadeArray(
      this.walkers.map((elemento) => {
        return elemento.sexoString;
      }),
      '',
      'Sexo'
    );
  }

  public get causaDaMortePorQuantidade(): any[] {
    return calcularQuantidadeArray(
      this.walkersMortos,
      'causaDaMorte',
      'Causa da Morte'
    );
  }

  public get mediasWalkers(): { chave: string; media: number }[] {
    let retorno: { chave: string; media: number }[] = [];
    let totalIndividuos: number = this.totalWalkersVivos;
    let velocidades: number = 0;
    this.walkers.forEach((elem) => {
      velocidades += elem.velocidade;
    });
    velocidades = velocidades / totalIndividuos;
    retorno.push({ chave: 'Velocidade', media: velocidades });
    return retorno;
  }

  ngOnInit(): void {
    //ordena as propriedades em ordem alfabética
    this.propriedadesPossiveis.sort((a, b) => {
      return a.chave > b.chave ? 1 : b.chave > a.chave ? -1 : 0;
    });
    this.propriedadeSelecionada = { ...this.propriedadesPossiveis[0] };
    this.velocidadeSimulacao = 1;
    this.gerarWalkers();
    this.loop();
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
          this.totalWalkersQueJaExixtiram + 1,
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
          sortearLongevidade(),
          0, //Id do pai
          0, //Id da mãe
          sortearTipoAlimento(),
          this.alimentos,
          this.walkers,
          this.walkersMortos
        )
      );
    }
  }

  gerarAlimentos() {
    this._flagGerarAlimentosX = !this._flagGerarAlimentosX;
    for (let i = 0; i < this.alimentosGeradosPorVez; i++) {
      this.alimentos.push(
        new Alimento(
          this._flagGerarAlimentosX
            ? Math.trunc(
                Math.min(
                  Math.abs(randn_bm() * (this.totalEixoX / 8)) +
                    this.totalEixoX / 2,
                  this.totalEixoX * 0.95
                )
              )
            : Math.trunc(
                Math.min(
                  Math.abs(randn_bm() * (this.totalEixoX / 8)),
                  this.totalEixoX * 0.95
                )
              ),
          Math.trunc(
            Math.min(
              randn_bm() * (this.totalEixoY / 8) + this.totalEixoY / 2,
              this.totalEixoY * 0.95
            )
          ),
          // nesse formato abaixo ele cria por quadrantes num plano cartesiano
          // this._flagGerarAlimentosX
          //   ? getRandomInt(10, this.totalEixoX / 2)
          //   : getRandomInt(this.totalEixoX / 2, this.totalEixoX),
          // this._flagGerarAlimentosY
          //   ? getRandomInt(10, this.totalEixoY / 2)
          //   : getRandomInt(this.totalEixoY / 2, this.totalEixoY),
          sortearTipoAlimento()
        )
      );
      this._totalAlimentoGerado++;
    }
  }

  private loop() {
    this.gerarAlimentos();
    setInterval(() => {
      this.tempoEmSegundos++;
    }, 1000);
  }

  /**
   * Ele sempre passa nessa funçaõ no começo
   * @param multiplicadorDeVelocidade numero de 1 a 5, sendo que quanto maior mais rápido a simulação irá acontecer
   */
  public mudarVelocidadeSimulacao(multiplicadorDeVelocidade: number) {
    this.multiplicadorDeVelocidade = multiplicadorDeVelocidade;

    this.walkers.forEach((walker) => {
      walker.multiplicadorDeVelocidade = this.multiplicadorDeVelocidade;
    });

    clearInterval(this._intervalAlimento);
    this._intervalAlimento = setInterval(() => {
      if (this.alimentos.length < this.alimentosGeradosPorVez) {
        this.gerarAlimentos();
      }
    }, 25000 / this.multiplicadorDeVelocidade);
  }

  // public trocarCorDeFundoEFazerAcao(
  //   walker: Walker,
  //   evento: {
  //     cor: string;
  //     x: number;
  //     y: number;
  //   }
  // ) {
  //   let corAntiga = walker.corDaBorda;
  //   walker.corDaBorda = evento.cor;
  //   setTimeout(() => {
  //     walker.corDaBorda = corAntiga;
  //   }, 5000);
  // }

  // private async ruidoDePerlin(x = 0.0, y = 0.0, incremento = 0.01) {
  //   var xoff = x;
  //   for (var x = 0; x < 100; x++) {
  //     var yoff = y;
  //     for (var y = 0; y < 50; y++) {
  //       // var bright = map(noise(xoff, yoff), 0, 1, 0, 255);
  //       console.log('xoff: ' + xoff.toFixed(2) + ' yoff: ' + yoff.toFixed(2));
  //       await sleep(100);
  //       yoff += incremento;
  //     }
  //     xoff += incremento;
  //   }
  // }

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
  public inverterMostrarConfiguracoes(): void {
    this.mostrarConfiguracoes = !this.mostrarConfiguracoes;
  }
  public inverterUsarDarkmode(): void {
    this.usarDarkMode = !this.usarDarkMode;
  }
  public inverterMostrarId(): void {
    this.mostrarId = !this.mostrarId;
  }

  public mudarAlimentoGeradoPorVez(numero: number) {
    this.alimentosGeradosPorVez = numero;
  }

  public mudarPropriedadeSelecionada(evento: any) {
    this.propriedadeSelecionada = {
      chave: evento.target.value.split('/&*')[0],
      valor: evento.target.value.split('/&*')[1],
    };
  }

  // colocarPassosPraTodos(numeroDePassos: number) {
  //   for (let i = 0; i < numeroDePassos; i++) {
  //     this.walkers.forEach((cadaUm) => {
  //       cadaUm.acrescentarPassos(this.sortearDirecao(), 2);
  //     });
  //   }
  // }
}
