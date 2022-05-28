import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulacaoInicialComponent } from './simulacao-inicial/simulacao-inicial.component';
import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada/simulacao-nao-encontrada.component';
import { WalkerComponent } from './componentes/walker/walker.component';
import { GraficoLinhaComponent } from './componentes/graficos/grafico-linha/grafico-linha.component';
import { TabelaSimplesComponent } from './componentes/tabelas/tabela-simples/tabela-simples.component';
import { AlimentoComponent } from './componentes/alimento/alimento.component';
import { CardWalkerComponent } from './componentes/card-walker/card-walker.component';
import { DadoSimplesComponent } from './componentes/dado-simples/dado-simples.component';
import { SliderComponent } from './componentes/slider/slider.component';
import { HomeComponent } from './home/home.component';
import { SimulacaoUpgradeComponent } from './simulacao-upgrade/simulacao-upgrade.component';
import { FormsModule } from '@angular/forms';

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
    HomeComponent,
    SimulacaoUpgradeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
