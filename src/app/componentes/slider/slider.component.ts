import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() label: string = '';
  @Input() valorMax: number = 0;
  @Input() valorMin: number = 0;
  @Output() onChange = new EventEmitter<number>();

  public valorAtual: number;

  constructor() {
    this.valorAtual = 0;
  }

  ngOnInit(): void {
    this.valorAtual = Math.max(Math.round(this.valorMax / 2), this.valorMin);
  }

  emitirEventoChange(event: any) {
    this.valorAtual = Math.round(event);
    this.onChange.emit(this.valorAtual);
  }
}
