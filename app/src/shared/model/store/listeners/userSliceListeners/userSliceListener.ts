import { createListenerMiddleware } from "@reduxjs/toolkit";

import {
  setUserData,
  setUserId,
} from "@/shared/model/store/reducers/userReducer";
import { exchangeApi } from "@/shared/api";

export const userSliceListener = createListenerMiddleware();

userSliceListener.startListening({
  actionCreator: setUserId,
  effect: async (action, listenerApi) => {
    try {
      const { data } = await listenerApi.dispatch(
        exchangeApi.endpoints.userList.initiate(
          {
            userId: action.payload,
          },
          { forceRefetch: true }
        )
      );

      if (data) {
        listenerApi.dispatch(setUserData(data));
      }
    } catch (e) {
      console.error(e)
    }
  },
});
