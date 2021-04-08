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
  @Input() height: number = window.innerHeight / 2;

  constructor() {}

  ngOnInit(): void {}

  public getClass(): string {
    return 'alimento' + this.tipo.toString();
  }

  public getStyle(): any {
    return {
      'margin-left': this.width + 'px',
      bottom: this.height + 'px',
    };
  }

  public teste(evento: any) {
    console.log(evento);
  }
}
