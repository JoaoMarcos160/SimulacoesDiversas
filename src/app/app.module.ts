import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TelaDeFundoComponent } from './tela-de-fundo/tela-de-fundo.component';
import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada/simulacao-nao-encontrada.component';
import { WalkerComponent } from './walker/walker.component';
import { GraficoLinhaComponent } from './graficos/grafico-linha/grafico-linha.component';
import { TabelaSimplesComponent } from './tabelas/tabela-simples/tabela-simples.component';
import { AlimentoComponent } from './alimento/alimento.component';

@NgModule({
  declarations: [
    AppComponent,
    TelaDeFundoComponent,
    SimulacaoNaoEncontradaComponent,
    WalkerComponent,
    GraficoLinhaComponent,
    TabelaSimplesComponent,
    AlimentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
