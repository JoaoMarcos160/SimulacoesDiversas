import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Walker } from '../classes/Walker';

@Component({
  selector: 'app-walker',
  templateUrl: './walker.component.html',
  styleUrls: ['./walker.component.scss'],
})
export class WalkerComponent implements OnInit {
  @Input() walker: Walker = <Walker>{};
  @Input() mostrarId: boolean = true;
  @Input() darkMode: boolean = false;

  // @Output() onClick = new EventEmitter<{ cor: string; x: number; y: number }>();

  constructor() {}

  ngOnInit(): void {}

  getStyle() {
    //mostra bordas pretas se morreu ou bordas vermelhas se estiver pronto para se reproduzir
    return {
      position: 'absolute',
      'background-color': this.walker.corDaBorda,
      padding: this.walker.tamanho + 'px',
      'margin-left': this.walker.x + 'px',
      bottom: this.walker.y + 'px',
      border:
        this.walker.causaDaMorte !== 'Ainda vivo'
          ? '3px solid black'
          : this.walker.prontoParaReproduzir
          ? this.walker.sexo
            ? '2px solid blue'
            : '2px solid red'
          : '',
    };
  }

  getStyleId() {
    return {
      position: 'absolute',
      color: this.darkMode ? 'white' : 'black',
      bottom: this.walker.y + this.walker.tamanho * 2 + 'px',
      'margin-left': (this.walker.x + this.walker.tamanho).toString() + 'px',
    };
  }

  // trocarCor(evento: any) {
  //   let obj = {
  //     cor: '#000000',
  //     x: evento.x,
  //     y: evento.y,
  //   };
  //   this.onClick.emit(obj);
  // }
}
