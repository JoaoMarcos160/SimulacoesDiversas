import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  private _valorAtual: number;

  @Input() label: string = '';
  @Input() valorMax: number;
  @Input() valorMin: number;

  @Input()
  public set valorAtual(value: number) {
    this._valorAtual = value;
    this.onChange.emit(value);
  }

  @Output() onChange = new EventEmitter<number>();

  public get valorAtual(): number {
    return this._valorAtual;
  }

  constructor() {
    this.valorMax = 0;
    this.valorMin = 0;
    this._valorAtual = 0;
  }

  emitirEventoChange(event: any) {
    this.valorAtual = Math.round(event);
    this.onChange.emit(this.valorAtual);
  }
}
