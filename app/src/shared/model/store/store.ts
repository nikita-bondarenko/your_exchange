// src/lib/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {uiReducer, authReducer, userReducer, requestDetailsReducer, exchangeReducer, exchangeSliceListener, validateListener, userSliceListener} from "@/shared/model/store"
import { api } from "@/shared/api";
import { saveState, loadState } from "@/shared/lib/store";
import { pageDataReducer } from "./reducers/pageDataReducer";

const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
  requestDetails: requestDetailsReducer,
  exchange: exchangeReducer,
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  pageData: pageDataReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedState = await loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
      .prepend(
        exchangeSliceListener.middleware,
        validateListener.middleware,
        userSliceListener.middleware
      )
      .concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    exchange: state.exchange,
    requestDetails: state.requestDetails,
    // pageData: state.pageData
    // user: state.user,  
  });
});

export type AppDispatch = typeof store.dispatch;


