import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-walker',
  templateUrl: './walker.component.html',
  styleUrls: ['./walker.component.scss'],
})
export class WalkerComponent implements OnInit {
  @Input() width: number = 50;
  @Input() heigth: number = 50;
  @Input() corDaBorda: string = '#000000';

  @Output() onClick = new EventEmitter<{ cor: string; x: number; y: number }>();

  constructor() {}

  ngOnInit(): void {}

  getStyle() {
    return {
      position: 'absolute',
      'margin-left': this.width + 'px',
      'margin-top': this.heigth + 'px',
      border: '2px solid ' + this.corDaBorda,
    };
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
