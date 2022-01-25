import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableServiceComponentComponent } from './table-service-component.component';

describe('TableServiceComponentComponent', () => {
  let component: TableServiceComponentComponent;
  let fixture: ComponentFixture<TableServiceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableServiceComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableServiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
