import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabela-simples',
  templateUrl: './tabela-simples.component.html',
  styleUrls: ['./tabela-simples.component.scss'],
})
export class TabelaSimplesComponent implements OnInit {
  @Input() total: number = 0;
  @Input() textField: string = '';
  @Input() valueField: string | number = '';
  @Input() dados: { [key: string]: any }[] = [];

  constructor() {}

  ngOnInit(): void {}
}
