import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Hero } from '../shared/hero.model';
import { HeroService } from '../shared/hero.service';
import * as HeroActions from './hero.actions';

@Injectable()
export class HeroEffects {
  constructor(private actions$: Actions, private heroService: HeroService) {}

  searchHeroes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.searchHero),
      switchMap(() =>
        this.heroService.searchHeroes().pipe(
          map((heroes: Hero[]) => HeroActions.searchHeroSuccess({ heroes })),
          catchError(() => of(HeroActions.searchHeroError()))
        )
      )
    )
  );

  getHeroById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.getHeroById),
      switchMap(({ id }) =>
        this.heroService.getHeroById(id).pipe(
          map((hero: Hero) => HeroActions.getHeroByIdSuccess({ hero })),
          catchError(() => of(HeroActions.getHeroByIdError()))
        )
      )
    )
  );

  createHero$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.createHero),
      switchMap(({ hero }) =>
        this.heroService.createHero(hero).pipe(
          map(response => HeroActions.createHeroSuccess({ response })),
          catchError(() => of(HeroActions.createHeroError()))
        )
      )
    )
  );

  voteHero$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.voteHero),
      switchMap(({ hero }) =>
        this.heroService.voteHero(hero).pipe(
          map(response => HeroActions.voteHeroSuccess({ response })),
          catchError(() => of(HeroActions.voteHeroError()))
        )
      )
    )
  );

  removeHero$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.removeHero),
      switchMap(({ id }) =>
        this.heroService.removeHero(id).pipe(
          map(response => HeroActions.removeHeroSuccess({ response })),
          catchError(() => of(HeroActions.removeHeroError()))
        )
      )
    )
  );
}
