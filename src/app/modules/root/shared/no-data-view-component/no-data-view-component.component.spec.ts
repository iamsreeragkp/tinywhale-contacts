import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataViewComponentComponent } from './no-data-view-component.component';

describe('NoDataViewComponentComponent', () => {
  let component: NoDataViewComponentComponent;
  let fixture: ComponentFixture<NoDataViewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDataViewComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
