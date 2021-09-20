import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as authReducer from './auth/auth.reducer';


export interface AppState {
   ui: ui.State,
   user: authReducer.State
}



export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: authReducer.authReducer
}