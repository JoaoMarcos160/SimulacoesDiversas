import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoInicialComponent } from './simulacao-inicial.component';

describe('SimulacaoInicialComponent', () => {
  let component: SimulacaoInicialComponent;
  let fixture: ComponentFixture<SimulacaoInicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacaoInicialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacaoInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
