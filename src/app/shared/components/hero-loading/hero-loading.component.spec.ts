import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeroLoadingComponent } from './hero-loading.component';
import { LoadingPlaceholderComponent } from '../loading-placeholder/loading-placeholder.component';
import { MockComponent } from 'ng-mocks';

describe('HeroLoadingComponent', () => {
  let component: HeroLoadingComponent;
  let fixture: ComponentFixture<HeroLoadingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [MockComponent(LoadingPlaceholderComponent), HeroLoadingComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HeroLoadingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
