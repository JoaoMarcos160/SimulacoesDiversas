import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoUpgradeComponent } from './simulacao-upgrade.component';

describe('SimulacaoUpgradeComponent', () => {
  let component: SimulacaoUpgradeComponent;
  let fixture: ComponentFixture<SimulacaoUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacaoUpgradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacaoUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
