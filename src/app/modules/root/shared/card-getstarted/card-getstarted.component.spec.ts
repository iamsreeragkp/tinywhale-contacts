import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGetstartedComponent } from './card-getstarted.component';

describe('CardGetstartedComponent', () => {
  let component: CardGetstartedComponent;
  let fixture: ComponentFixture<CardGetstartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardGetstartedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardGetstartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
