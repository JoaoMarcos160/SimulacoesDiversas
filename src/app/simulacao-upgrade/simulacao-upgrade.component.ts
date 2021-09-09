import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss']
})
export class SimulacaoUpgradeComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
  }

}
