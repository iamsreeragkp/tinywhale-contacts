import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MockComponent } from 'ng-mocks';
import { APP_CONFIG, AppConfig } from '../../../../configs/app.config';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ROUTES_CONFIG, RoutesConfig } from '../../../../configs/routes.config';
import { StorageService } from '../../../../shared/services/storage.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const storageServiceSpy = jasmine.createSpyObj('StorageService', [
    'getCookie',
    'setCookie',
    'removeCookie',
  ]);
  const progressBarServiceSpy = jasmine.createSpyObj('ProgressBarService', [
    'getUpdateProgressBar',
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [MockComponent(SearchBarComponent), HeaderComponent],
        providers: [
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: APP_CONFIG, useValue: AppConfig },
          { provide: ROUTES_CONFIG, useValue: RoutesConfig },
        ],
      }).compileComponents();

      storageServiceSpy.getCookie.and.returnValue('en');
      progressBarServiceSpy.getUpdateProgressBar.and.returnValue(of('query'));

      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create header component', () => {
    expect(component).toBeTruthy();
  });

  it('should change the language', () => {
    storageServiceSpy.setCookie.and.returnValue(true);
    expect(component.selectedLanguage).toBe('en');
    component.changeLanguage('es');
    expect(component.selectedLanguage).toBe('es');
  });
});
