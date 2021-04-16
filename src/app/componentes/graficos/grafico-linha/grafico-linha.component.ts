import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafico-linha',
  templateUrl: './grafico-linha.component.html',
  styleUrls: ['./grafico-linha.component.scss'],
})
export class GraficoLinhaComponent implements OnInit {
  @Input() dados: any[] = [];
  
  constructor() {}

  ngOnInit(): void {}
}
