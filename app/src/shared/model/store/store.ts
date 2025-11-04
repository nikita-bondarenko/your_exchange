import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  uiReducer,
  userReducer,
  requestDetailsReducer,
  exchangeReducer,
  exchangeSliceListener,
  validateListener,
  userSliceListener,
  featuresFlagsReducer,
  transferAbroadReducer,
} from "@/shared/model/store";
import { exchangeApi, transferAbroadApi } from "@/shared/api";
import { saveState, loadState } from "@/shared/lib/store";
import { pageDataReducer } from "./reducers/pageDataReducer";

const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
  requestDetails: requestDetailsReducer,
  exchange: exchangeReducer,
  [exchangeApi.reducerPath]: exchangeApi.reducer,
  [transferAbroadApi.reducerPath]: transferAbroadApi.reducer,
  pageData: pageDataReducer,
  featuresFlags: featuresFlagsReducer,
  transferAbroad: transferAbroadReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
      .concat(exchangeApi.middleware)
      .concat(transferAbroadApi.middleware)
      .prepend(userSliceListener?.middleware)
      .prepend(exchangeSliceListener?.middleware)
      .prepend(validateListener?.middleware),

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

export type AppDispatch = typeof store.dispatch;
