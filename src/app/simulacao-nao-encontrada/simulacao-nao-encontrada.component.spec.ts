import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoNaoEncontradaComponent } from './simulacao-nao-encontrada.component';

describe('SimulacaoNaoEncontradaComponent', () => {
  let component: SimulacaoNaoEncontradaComponent;
  let fixture: ComponentFixture<SimulacaoNaoEncontradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacaoNaoEncontradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacaoNaoEncontradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
