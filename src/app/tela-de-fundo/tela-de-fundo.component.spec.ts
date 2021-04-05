import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaDeFundoComponent } from './tela-de-fundo.component';

describe('TelaDeFundoComponent', () => {
  let component: TelaDeFundoComponent;
  let fixture: ComponentFixture<TelaDeFundoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaDeFundoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaDeFundoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
