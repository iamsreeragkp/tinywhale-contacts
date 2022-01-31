import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessInfoComponent } from './add-business-info.component';

describe('AddBusinessInfoComponent', () => {
  let component: AddBusinessInfoComponent;
  let fixture: ComponentFixture<AddBusinessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusinessInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
