import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadoSimplesComponent } from './dado-simples.component';

describe('DadoSimplesComponent', () => {
  let component: DadoSimplesComponent;
  let fixture: ComponentFixture<DadoSimplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadoSimplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadoSimplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
