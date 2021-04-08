import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWalkerComponent } from './card-walker.component';

describe('CardWalkerComponent', () => {
  let component: CardWalkerComponent;
  let fixture: ComponentFixture<CardWalkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardWalkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWalkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
