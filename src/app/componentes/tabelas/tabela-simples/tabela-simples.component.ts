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
  @Input() usarValueFieldComoCor: boolean = false;

  public expandido: boolean = false;
  public direcaoOrganizacaoTextField: boolean = false;
  public direcaoOrganizacaoValueField: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  inverterExpandido() {
    this.expandido = !this.expandido;
  }

  organizarPorTextField() {
    if (this.direcaoOrganizacaoTextField) {
      this.dados = this.dados.sort((a, b) => {
        return a[this.textField] - b[this.textField];
      });
    } else {
      this.dados = this.dados.sort((a, b) => {
        return b[this.textField] - a[this.textField];
      });
    }
    this.direcaoOrganizacaoTextField = !this.direcaoOrganizacaoTextField;
  }

  organizarPorValueField() {
    //se for string ele ordena por ordem alfabética
    if (typeof this.valueField === 'string') {
      if (this.direcaoOrganizacaoValueField) {
        this.dados = this.dados.sort((a, b) => {
          return a[this.valueField] > b[this.valueField]
            ? 1
            : b[this.valueField] > a[this.valueField]
            ? -1
            : 0;
        });
      } else {
        this.dados = this.dados.sort((a, b) => {
          return b[this.valueField] > a[this.valueField]
            ? 1
            : a[this.valueField] > b[this.valueField]
            ? -1
            : 0;
        });
      }
    } else {
      if (this.direcaoOrganizacaoValueField) {
        this.dados = this.dados.sort((a, b) => {
          return a[this.valueField] - b[this.valueField];
        });
      } else {
        this.dados = this.dados.sort((a, b) => {
          return b[this.valueField] - a[this.valueField];
        });
      }
    }
    this.direcaoOrganizacaoValueField = !this.direcaoOrganizacaoValueField;
  }
}
