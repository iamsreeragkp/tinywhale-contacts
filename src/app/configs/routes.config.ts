import { InjectionToken } from '@angular/core';

export const ROUTES_CONFIG = new InjectionToken('routes.config');

const basePaths = {
  hero: 'hero',
  auth: 'auth',
  website: 'website',
  account: 'account'
};

const routesNames = {
  home: 'home',
  error404: '404',
  hero: {
    myHeroes: 'my-heroes',
    detail: ':id',
  },
  auth: {
    signUp: 'sign-up',
    logIn: 'log-in',
    forgotPassword:'forgot-password',
    createPassword:'create-password',
  },
  website:{
    home:"home",
    addBusinessInfo:"add-business-info",
    viewBusinessInfo:"view-business-info",
    editBusinessInfo:"edit-business-info"
  },
  account:{
    home:'home',
    settings:'settings'
  }
};

export const getHeroDetail = (id: string) => `/${basePaths.hero}/${id}`;

export const RoutesConfig = {
  basePaths,
  routesNames,
  routes: {
    home: `/${routesNames.home}`,
    error404: `/${routesNames.error404}`,
    hero: {
      myHeroes: `/${basePaths.hero}/${routesNames.hero.myHeroes}`,
      detail: getHeroDetail,
    },
    auth: {
      signUp: `/${basePaths.auth}/${routesNames.auth.signUp}`,
      logIn: `/${basePaths.auth}/${routesNames.auth.logIn}`,
    },
    website:{
      home: `/${basePaths.website}/${routesNames.website.home}`,
      website: `/${basePaths.website}/${routesNames.website.addBusinessInfo}`,
      viewBusinessInfo: `/${basePaths.website}/${routesNames.website.viewBusinessInfo}`,
      editBusinessInfo: `/${basePaths.website}/${routesNames.website.editBusinessInfo}`,
    },
    account:{
      home:`/${basePaths.account}/${routesNames.account.home}`,
      settings:`/${basePaths.account}/${routesNames.account.settings}`
    }
  },
};

