import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlistDropdownComponentComponent } from './contactlist-dropdown-component.component';

describe('ContactlistDropdownComponentComponent', () => {
  let component: ContactlistDropdownComponentComponent;
  let fixture: ComponentFixture<ContactlistDropdownComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactlistDropdownComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlistDropdownComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
