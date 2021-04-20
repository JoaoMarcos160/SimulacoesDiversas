import { Component, Input, OnInit } from '@angular/core';
import { Walker } from '../classes/Walker';

@Component({
  selector: 'app-card-walker',
  templateUrl: './card-walker.component.html',
  styleUrls: ['./card-walker.component.scss'],
})
export class CardWalkerComponent implements OnInit {
  @Input() walker: Walker = <Walker>{};

  constructor() {}

  ngOnInit(): void {}

  getStyle() {
    // ele soma a posição do walker + o tamanho + o padding * 2 (pq tem padding em cima e em baixo) + o tamanho da imagem do walker,
    // o padding nesse caso é 5 então ele soma 10, e a imagem tem tamanho 14px = 24
    return {
      bottom: (this.walker.y + this.walker.tamanho + 24).toString() + 'px',
      'margin-left':
        (this.walker.x + this.walker.tamanho + 24).toString() + 'px',
      padding: '5px',
    };
  }

  public getUltimoPasso(): string {
    return [
      'Cima',
      'Cima Direita',
      'Direita',
      'Baixo Direita',
      'Baixo',
      'Baixo Esquerda',
      'Esquerda',
      'Cima Esquerda',
    ][this.walker.ultimoPasso.direcao || 0];
  }
}
