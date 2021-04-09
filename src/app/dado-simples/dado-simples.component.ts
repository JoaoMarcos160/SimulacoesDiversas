import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dado-simples',
  templateUrl: './dado-simples.component.html',
  styleUrls: ['./dado-simples.component.scss'],
})
export class DadoSimplesComponent implements OnInit {
  @Input() dado: any;
  @Input() tituloDado: string = '';

  public expandido: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  inverterExpandido(): void {
    this.expandido = !this.expandido;
  }
}
