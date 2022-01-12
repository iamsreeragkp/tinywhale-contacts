import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeroCardComponent } from './hero-card.component';
import { Hero } from '../../../modules/hero/shared/hero.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ROUTES_CONFIG, RoutesConfig } from '../../../configs/routes.config';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { HeroService } from '../../../modules/hero/shared/hero.service';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;

  const heroServiceSpy = jasmine.createSpyObj('HeroService', ['updateHero']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, LazyLoadImageModule],
        declarations: [HeroCardComponent],
        providers: [
          { provide: HeroService, useValue: heroServiceSpy },
          { provide: ROUTES_CONFIG, useValue: RoutesConfig },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HeroCardComponent);
      component = fixture.componentInstance;
      heroServiceSpy.updateHero.and.returnValue(of([new Hero({ name: 'hero test' })]));
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
