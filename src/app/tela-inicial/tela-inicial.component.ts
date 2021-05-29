import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.scss'],
})
export class TelaInicialComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {}

  navegarPara(url: string) {
    this.route.navigate([url]);
  }
}
