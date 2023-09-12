import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SimulacaoIaComponent } from './simulacao-ia/simulacao-ia.component';
import { SimulacaoInicialComponent } from './simulacao-inicial/simulacao-inicial.component';
import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada/simulacao-nao-encontrada.component';
import { SimulacaoUpgradeComponent } from './simulacao-upgrade/simulacao-upgrade.component';

const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  {
    path: 'SimulacaoInicial/:numeroDeIndividuos',
    component: SimulacaoInicialComponent,
  },
  { path: 'simulacao-ia/:population', component: SimulacaoIaComponent },
  { path: 'SimulacaoInicial', component: SimulacaoInicialComponent },
  { path: 'SimulacaoUpgrade', component: SimulacaoUpgradeComponent },
  { path: '**', component: SimulacaoNaoEncontradaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
