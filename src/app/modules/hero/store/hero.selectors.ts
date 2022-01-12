import { createSelector } from '@ngrx/store';
import { IAppState } from '../../core/reducers';
import { IHeroState } from './hero.reducers';

export const selectheroesList = createSelector(
  (state: IAppState) => state.hero,
  (state: IHeroState) => state.list
);

export const selectgetHero = createSelector(
  (state: IAppState) => state.hero,
  (state: IHeroState) => state.hero
);
