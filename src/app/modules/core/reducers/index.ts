import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { IUserState, userReducer } from '../../user/store/user.reducers';
import { IAuthState, authReducer } from '../../auth/store/auth.reducers';
import { IWebsiteState, websiteReducer } from '../../website/store/website.reducers';
import { IServiceState, serviceReducer } from '../../service/store/service.reducers';
import { bookingReducer, IBookingState } from '../../booking/store/booking.reducers';
import { IRootState, rootReducer } from '../../root/store/root.reducers';
import { IAccountState, accountReducer } from '../../accounts/store/account.reducers';

export interface IAppState {
  user: IUserState;
  root: IRootState;
  auth: IAuthState;
  website: IWebsiteState;
  service: IServiceState;
  booking: IBookingState;
  account: IAccountState;
}

export const reducers: ActionReducerMap<IAppState> = {
  user: userReducer,
  root: rootReducer,
  auth: authReducer,
  website: websiteReducer,
  service: serviceReducer,
  booking: bookingReducer,
  account: accountReducer
};
export const metaReducers: MetaReducer<IAppState>[] = [];
