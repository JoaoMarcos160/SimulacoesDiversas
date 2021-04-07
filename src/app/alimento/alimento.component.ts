import { Component, Input, OnInit } from '@angular/core';
import { AlimentoTipo } from '../enums/AlimentoTipoEnum';

@Component({
  selector: 'app-alimento',
  templateUrl: './alimento.component.html',
  styleUrls: ['./alimento.component.scss'],
})
export class AlimentoComponent implements OnInit {
  @Input() tipo: AlimentoTipo = AlimentoTipo.tipo1;
  @Input() width: number = window.innerWidth / 2;
  @Input() heigth: number = window.innerHeight / 2;

  constructor() {}

  ngOnInit(): void {}

  public getClass(): string {
    switch (this.tipo) {
      case AlimentoTipo.tipo1:
        return 'alimento1';
      case AlimentoTipo.tipo2:
        return 'alimento2';
      case AlimentoTipo.tipo3:
        return 'alimento3';
      case AlimentoTipo.tipo4:
        return 'alimento4';
      default:
        return 'alimento1';
    }
  }

  public getStyle(): any {
    return {
      border: '2px solid black',
      'max-width': '5px',
      'max-heigth': '5px',
      'border-radius': '10px',
      'margin-left': this.width + 'px',
      bottom: this.heigth + 'px',
    };
  }
}
