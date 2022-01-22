import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusinessInfoComponent } from './view-business-info.component';

describe('ViewBusinessInfoComponent', () => {
  let component: ViewBusinessInfoComponent;
  let fixture: ComponentFixture<ViewBusinessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBusinessInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBusinessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
