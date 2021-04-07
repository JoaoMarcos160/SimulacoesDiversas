import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaSimplesComponent } from './tabela-simples.component';

describe('TabelaSimplesComponent', () => {
  let component: TabelaSimplesComponent;
  let fixture: ComponentFixture<TabelaSimplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabelaSimplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabelaSimplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
