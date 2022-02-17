import { InjectionToken } from '@angular/core';

export const ROUTES_CONFIG = new InjectionToken('routes.config');

const basePaths = {
  home: 'home',
  auth: 'auth',
  website: 'website',
  service: 'service',
  booking: 'booking',
  account: 'account',
};

const routesNames = {
  home: {
    dashboard: 'dashboard',
    addBusinessInfo: 'add-business-info',
    addService: 'add-service',
    addPayment: 'add-payment',
  },
  error404: '404',
  auth: {
    signUp: 'sign-up',
    logIn: 'log-in',
    forgotPassword: 'forgot-password',
    createPassword: 'create-password',
  },
  website: {
    home: 'home',
    addBusinessInfo: 'add-business-info',
    viewBusinessInfo: 'view-business-info',
    editBusinessInfo: 'edit-business-info',
  },
  service: {
    home: 'home',
    addService: 'add-service',
    editService: 'edit-service/:id',
    viewService: 'view-service/:id',
  },
  booking: {
    home: 'home',
    addBooking: 'add-booking',
    viewBooking: 'view-booking',
    statusBooking: 'status-booking/:id',
    editBooking: 'edit-booking/:id',
  },
  account: {
    home: 'home',
    settings: 'settings',
    addPayment: 'add-payment',
    viewPayment: 'view-payment',
    editPayment: 'edit-payment',
  },
};

export const RoutesConfig = {
  basePaths,
  routesNames,
  routes: {
    home: {
      dashboard: `/${basePaths.home}/${routesNames.home.dashboard}`,
      addBusinessInfo: `/${basePaths.home}/${routesNames.home.addBusinessInfo}`,
      addService: `/${basePaths.home}/${routesNames.home.addService}`,
      addPayment: `/${basePaths.home}/${routesNames.home.addPayment}`,
    },
    error404: `/${routesNames.error404}`,
    auth: {
      signUp: `/${basePaths.auth}/${routesNames.auth.signUp}`,
      logIn: `/${basePaths.auth}/${routesNames.auth.logIn}`,
    },
    website: {
      home: `/${basePaths.website}/${routesNames.website.home}`,
      website: `/${basePaths.website}/${routesNames.website.addBusinessInfo}`,
      viewBusinessInfo: `/${basePaths.website}/${routesNames.website.viewBusinessInfo}`,
      editBusinessInfo: `/${basePaths.website}/${routesNames.website.editBusinessInfo}`,
    },
    service: {
      home: `/${basePaths.service}/${routesNames.service.home}`,
      service: `/${basePaths.service}/${routesNames.service.addService}`,
      viewService: `/${basePaths.service}/${routesNames.service.viewService}`,
    },
    booking: {
      home: `/${basePaths.booking}/${routesNames.booking.home}`,
      booking: `/${basePaths.booking}/${routesNames.booking.addBooking}`,
      viewBooking: `/${basePaths.booking}/${routesNames.booking.viewBooking}`,
      statusBooking: `/${basePaths.booking}/${routesNames.booking.statusBooking}`,
      editBooking: `/${basePaths.booking}/${routesNames.booking.editBooking}`,
    },
    account: {
      home: `/${basePaths.account}/${routesNames.account.home}`,
      settings: `/${basePaths.account}/${routesNames.account.settings}`,
      addPayment: `/${basePaths.account}/${routesNames.account.addPayment}`,
      viewPayment: `/${basePaths.account}/${routesNames.account.viewPayment}`,
      editPayment: `/${basePaths.account}/${routesNames.account.editPayment}`,
    },
  },
};
