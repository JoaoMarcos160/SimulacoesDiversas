import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada/simulacao-nao-encontrada.component';
import { SimulacaoInicialComponent } from './simulacao-inicial/simulacao-inicial.component';

const routes: Routes = [
  { path: '', redirectTo: 'SimulacaoInicial', pathMatch: 'full' },
  { path: 'SimulacaoInicial/:numeroDeIndividuos', component: SimulacaoInicialComponent },
  { path: 'SimulacaoInicial', component: SimulacaoInicialComponent },
  { path: '**', component: SimulacaoNaoEncontradaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
