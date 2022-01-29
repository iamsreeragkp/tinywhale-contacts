import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { IUserState, userReducer } from '../../user/store/user.reducers';
import { IAuthState, authReducer } from '../../auth/store/auth.reducers';
import { IWebsiteState, websiteReducer } from '../../website/store/website.reducers';
import { IServiceState, serviceReducer } from '../../service/store/service.reducers';
import { bookingReducer, IBookingState } from '../../booking/store/booking.reducers';

export interface IAppState {
  user: IUserState;
  auth: IAuthState;
  website: IWebsiteState;
  service: IServiceState;
  booking: IBookingState;
}

export const reducers: ActionReducerMap<IAppState> = {
  user: userReducer,
  auth: authReducer,
  website: websiteReducer,
  service: serviceReducer,
  booking: bookingReducer,
};
export const metaReducers: MetaReducer<IAppState>[] = [];
