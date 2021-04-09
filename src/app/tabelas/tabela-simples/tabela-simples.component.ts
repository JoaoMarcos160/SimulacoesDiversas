import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabela-simples',
  templateUrl: './tabela-simples.component.html',
  styleUrls: ['./tabela-simples.component.scss'],
})
export class TabelaSimplesComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() textField: string = '';
  @Input() valueField: string | number = '';
  @Input() dados: { [key: string]: any }[] = [];
  @Input() total: number = 0;

  public expandido: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  inverterExpandido() {
    this.expandido = !this.expandido;
  }
}
