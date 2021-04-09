import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Walker } from '../classes/Walker';

@Component({
  selector: 'app-walker',
  templateUrl: './walker.component.html',
  styleUrls: ['./walker.component.scss'],
})
export class WalkerComponent implements OnInit {
  @Input() width: number = 50;
  @Input() height: number = 50;
  @Input() corDaBorda: string = '#000000';
  @Input() tamanho: number = 50;

  @Output() onClick = new EventEmitter<{ cor: string; x: number; y: number }>();

  constructor() {}

  ngOnInit(): void {}

  getStyle() {
    return {
      position: 'absolute',
      'background-color': this.corDaBorda,
      padding: this.tamanho + 'px',
      'margin-left': this.width + 'px',
      bottom: this.height + 'px',
    };
    // screenY: this.width,
    // screenX: this.height,
  }

  trocarCor(evento: any) {
    let obj = {
      cor: '#000000',
      x: evento.x,
      y: evento.y,
    };
    this.onClick.emit(obj);
  }
}
