import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoIaComponent } from './simulacao-ia.component';

describe('SimulacaoIaComponent', () => {
  let component: SimulacaoIaComponent;
  let fixture: ComponentFixture<SimulacaoIaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulacaoIaComponent]
    });
    fixture = TestBed.createComponent(SimulacaoIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
