import { createReducer, on, Action } from '@ngrx/store';
import * as HeroActions from './hero.actions';
import { Hero } from '../shared/hero.model';
import { ResponseType } from 'src/app/shared/interfaces/response-type.interface';

export const userFeatureKey = 'HeroState';

export interface IHeroState {
  list: Hero[];
  hero?: Hero;
  createHeroStatus?: ResponseType;
  voteHeroStatus?: ResponseType;
  removeHeroStatus?: ResponseType;
}

export const initialHeroState: IHeroState = {
  list: [],
  hero: undefined,
  createHeroStatus: undefined,
  voteHeroStatus: undefined,
  removeHeroStatus: undefined,
};

export const reducer = createReducer(
  initialHeroState,
  on(HeroActions.searchHeroSuccess, (state, { heroes }) => ({
    ...state,
    list: heroes,
  })),
  on(HeroActions.searchHeroError, state => ({
    ...state,
    list: [],
  })),
  on(HeroActions.getHeroByIdSuccess, (state, { hero }) => ({
    ...state,
    hero,
  })),
  on(HeroActions.getHeroByIdError, state => ({
    ...state,
    hero: undefined,
  })),
  on(HeroActions.createHeroSuccess, (state, { response: createHeroResponse }) => ({
    ...state,
    createHeroResponse,
  })),
  on(HeroActions.createHeroError, state => ({
    ...state,
    createHeroResponse: { status: false },
  })),
  on(HeroActions.voteHeroSuccess, (state, { response: voteHeroResponse }) => ({
    ...state,
    voteHeroResponse,
  })),
  on(HeroActions.voteHeroError, state => ({
    ...state,
    voteHeroResponse: { status: false },
  })),
  on(HeroActions.removeHeroSuccess, (state, { response: removeHeroResponse }) => ({
    ...state,
    removeHeroResponse,
  })),
  on(HeroActions.removeHeroError, state => ({
    ...state,
    removeHeroResponse: { status: false },
  }))
);

export function heroReducer(state: IHeroState | undefined, action: Action): IHeroState {
  return reducer(state as IHeroState, action as Action);
}
