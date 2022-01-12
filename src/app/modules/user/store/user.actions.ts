import { createAction, props } from '@ngrx/store';
import { User } from '../shared/user.model';

export const getMe = createAction('[UserModule] GET USER');

export const getMeSuccess = createAction('[UserModule] GET USER SUCCESS', props<{ user: User }>());

export const getMeError = createAction('[UserModule] GET USER ERROR');
