import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultServiceComponentComponent } from './no-result-service-component.component';

describe('NoResultServiceComponentComponent', () => {
  let component: NoResultServiceComponentComponent;
  let fixture: ComponentFixture<NoResultServiceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoResultServiceComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultServiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
