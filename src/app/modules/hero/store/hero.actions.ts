import { createAction, props } from '@ngrx/store';
import { Hero } from '../shared/hero.model';

export const searchHero = createAction('[heroModule] SEARCH HERO');

export const searchHeroSuccess = createAction(
  '[heroModule] SEARCH HERO SUCCESS',
  props<{ heroes: Hero[] }>()
);

export const searchHeroError = createAction('[heroModule] SEARCH HERO ERROR');

export const getHeroById = createAction('[heroModule] GET HERO BY ID', props<{ id: string }>());

export const getHeroByIdSuccess = createAction(
  '[heroModule] GET HERO BY ID SUCCESS',
  props<{ hero: Hero }>()
);

export const getHeroByIdError = createAction('[heroModule] GET HERO BY ID ERROR');

export const createHero = createAction('[heroModule] CREATE HERO', props<{ hero: Hero }>());

export const createHeroSuccess = createAction(
  '[heroModule] CREATE HERO SUCCESS',
  props<{ response: ResponseType }>()
);

export const createHeroError = createAction('[heroModule] CREATE HERO ERROR');

export const voteHero = createAction('[heroModule] VOTE HERO', props<{ hero: Hero }>());

export const voteHeroSuccess = createAction(
  '[heroModule] VOTE HERO SUCCESS',
  props<{ response: ResponseType }>()
);

export const voteHeroError = createAction('[heroModule] VOTE HERO ERROR');

export const removeHero = createAction('[heroModule] REMOVE HERO', props<{ id: string }>());

export const removeHeroSuccess = createAction(
  '[heroModule] REMOVE HERO SUCCESS',
  props<{ response: ResponseType }>()
);

export const removeHeroError = createAction('[heroModule] REMOVE HERO ERROR');
