import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { saveState, loadState } from "@/shared/lib/store";
import {
  featuresFlagsReducer,
  pageDataReducer,
  requestDetailsReducer,
  uiReducer,
} from "@/shared/model/store";
import { exchangeApi } from "@/d__features/exchange/api";
import {
  exchangeReducer,
  exchangeSliceListener,
  validateListener,
} from "@/d__features/exchange/model";
import { transferAbroadApi } from "@/d__features/transferAbroad/api";
import { transferAbroadReducer } from "@/d__features/transferAbroad/model";
import {
  userReducer,
  userSliceListener,
} from "@/d__features/userDataDisplay/model";
import { userApi } from "@/d__features/userDataDisplay/api";

const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
  requestDetails: requestDetailsReducer,
  exchange: exchangeReducer,
  [exchangeApi.reducerPath]: exchangeApi.reducer,
  [transferAbroadApi.reducerPath]: transferAbroadApi.reducer,
  [userApi.reducerPath]: userApi.reducer,

  pageData: pageDataReducer,
  featuresFlags: featuresFlagsReducer,
  transferAbroad: transferAbroadReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
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
      .concat(exchangeApi.middleware)
      .concat(transferAbroadApi.middleware)
      .concat(userApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    exchange: state.exchange,
    requestDetails: state.requestDetails,
    featuresFlags: state.featuresFlags,
    transferAbroad: state.transferAbroad,
    // pageData: state.pageData
    // user: state.user,
  });
});
