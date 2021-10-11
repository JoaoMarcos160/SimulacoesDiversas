import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkerComponent } from './walker.component';

describe('WalkerComponent', () => {
  let component: WalkerComponent;
  let fixture: ComponentFixture<WalkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
