// src/lib/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";

import userReducer from "./slices/userSlice/userSlice";
import requestDetailsReducer from "./slices/requestDetailsSlice";
import { loadState, saveState } from "./persistConfig";
import exchangeReducer from "./slices/exchangeSlice/exchangeSlice";
import { exchangeSliceListener } from "./listeners/exchangeSliceListeners/exchangeSliceListener";
import { validateListener } from "./listeners/exchangeSliceListeners/validateListener";
import { api } from "./api/cryptusApi";
import { userSliceListener } from "./listeners/userSliceListeners/userSliceListener";

const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
  requestDetails: requestDetailsReducer,
  exchange: exchangeReducer,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedState = loadState() as Partial<RootState> | undefined;

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
  // Only persist specific parts of the state that we want to keep
  saveState({
    exchange: state.exchange,
    requestDetails: state.requestDetails,
    user: state.user,
  });
});

export type AppDispatch = typeof store.dispatch;


