import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MyHeroesPageComponent } from './my-heroes-page.component';
import { LoadingPlaceholderComponent } from '../../../../shared/components/loading-placeholder/loading-placeholder.component';
import { Hero } from '../../shared/hero.model';
import { of } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeroRemoveComponent } from '../../components/hero-remove/hero-remove.component';
import { Router } from '@angular/router';
import { MockComponent, MockModule } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { ROUTES_CONFIG, RoutesConfig } from '../../../../configs/routes.config';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeroService } from '../../shared/hero.service';

describe('HeroesListPageComponent', () => {
  let component: MyHeroesPageComponent;
  let fixture: ComponentFixture<MyHeroesPageComponent>;
  let router: Router;
  let navigateSpy;

  const heroServiceSpy = jasmine.createSpyObj('HeroService', [
    'createHero',
    'searchHeroes',
    'updateHero',
    'removeHero',
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule],
        declarations: [
          MockComponent(HeroRemoveComponent),
          MockComponent(LoadingPlaceholderComponent),
          MyHeroesPageComponent,
        ],
        providers: [
          { provide: HeroService, useValue: heroServiceSpy },
          { provide: ROUTES_CONFIG, useValue: RoutesConfig },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MyHeroesPageComponent);
      component = fixture.debugElement.componentInstance;
      router = TestBed.inject(Router);
      navigateSpy = spyOn(router, 'navigate');
      heroServiceSpy.searchHeroes.and.returnValue(of([new Hero({ is: 1, name: 'hero test' })]));
      heroServiceSpy.removeHero.and.returnValue(of(true));
      fixture.detectChanges();
    })
  );

  it('should create component and load heroes', () => {
    expect(component).toBeTruthy();
  });

  xit('should create new hero success', () => {
    heroServiceSpy.createHero.and.returnValue(of('asd'));
    component.newHeroForm = new FormGroup({
      name: new FormControl('new hero!', [Validators.required, Validators.maxLength(30)]),
      alterEgo: new FormControl('haha', [Validators.required, Validators.maxLength(30)]),
    });

    component.error = false;
    component.createNewHero();
    expect(component.error).toBeFalse();
  });

  xit('should create new hero error', async () => {
    heroServiceSpy.createHero.and.returnValue(of(''));
    component.newHeroForm = new FormGroup({
      name: new FormControl('new hero!', [Validators.required, Validators.maxLength(30)]),
      alterEgo: new FormControl('haha', [Validators.required, Validators.maxLength(30)]),
    });

    component.error = false;
    await component.createNewHero();
    expect(component.error).toBe(true);
  });

  it('should delete a hero', () => {
    const hero = new Hero({ id: 'testId' });
    heroServiceSpy.removeHero.and.returnValue(of(true));
    component.deleteHero(hero);
    expect(heroServiceSpy.removeHero).toHaveBeenCalledWith('testId');
  });
});
