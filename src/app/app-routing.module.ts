import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada/simulacao-nao-encontrada.component';
import { TelaDeFundoComponent } from './tela-de-fundo/tela-de-fundo.component';

const routes: Routes = [
  { path: '', redirectTo: 'SimulacaoTeste', pathMatch: 'full' },
  { path: 'SimulacaoTeste/:numeroDeIndividuos', component: TelaDeFundoComponent },
  { path: 'SimulacaoTeste', component: TelaDeFundoComponent },
  { path: '**', component: SimulacaoNaoEncontradaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
