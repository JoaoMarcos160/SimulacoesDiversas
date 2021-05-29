import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulacaoInicialComponent } from './simulacao-inicial/simulacao-inicial.component';
import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada/simulacao-nao-encontrada.component';
import { WalkerComponent } from './walker/walker.component';
import { GraficoLinhaComponent } from './componentes/graficos/grafico-linha/grafico-linha.component';
import { TabelaSimplesComponent } from './componentes/tabelas/tabela-simples/tabela-simples.component';
import { AlimentoComponent } from './alimento/alimento.component';
import { CardWalkerComponent } from './card-walker/card-walker.component';
import { DadoSimplesComponent } from './componentes/dado-simples/dado-simples.component';
import { SliderComponent } from './componentes/slider/slider.component';
import { FormsModule } from '@angular/forms';
import { TelaInicialComponent } from './tela-inicial/tela-inicial.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulacaoInicialComponent,
    SimulacaoNaoEncontradaComponent,
    WalkerComponent,
    GraficoLinhaComponent,
    TabelaSimplesComponent,
    AlimentoComponent,
    CardWalkerComponent,
    DadoSimplesComponent,
    SliderComponent,
    TelaInicialComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
