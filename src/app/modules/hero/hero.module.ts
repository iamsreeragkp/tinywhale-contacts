import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserStoreModule } from '../user/store/user-store.module';
import { HeroRemoveComponent } from './components/hero-remove/hero-remove.component';
import { HeroRoutingModule } from './hero-routing.module';
import { HeroDetailPageComponent } from './pages/hero-detail-page/hero-detail-page.component';
import { MyHeroesPageComponent } from './pages/my-heroes-page/my-heroes-page.component';
import { HeroStoreModule } from './store/hero-store.module';

@NgModule({
  imports: [
    SharedModule,
    HeroRoutingModule,
    HeroStoreModule,
    UserStoreModule,
  ],
  declarations: [MyHeroesPageComponent, HeroDetailPageComponent, HeroRemoveComponent],
  entryComponents: [HeroRemoveComponent],
})
export class HeroModule {}
