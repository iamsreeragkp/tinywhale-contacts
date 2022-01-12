import { InjectionToken, Type } from '@angular/core';

export let ENDPOINTS_CONFIG = new InjectionToken<EndpointsType>('endpoints.config');

export const EndpointsConfig = {
  signUp: 'sign-up',
  logIn: 'log-in',
  searchHeroes: 'search-heroes',
  getHeroById: 'get-hero-by-id',
  createHero: 'create-hero',
  voteHero: 'vote-hero',
  removeHero: 'remove-hero',
  getMe: 'get-me',
};

export type EndpointsType = typeof EndpointsConfig;
