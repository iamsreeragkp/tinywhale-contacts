import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataServiceComponentComponent } from './no-data-service-component.component';

describe('NoDataServiceComponentComponent', () => {
  let component: NoDataServiceComponentComponent;
  let fixture: ComponentFixture<NoDataServiceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDataServiceComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataServiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
