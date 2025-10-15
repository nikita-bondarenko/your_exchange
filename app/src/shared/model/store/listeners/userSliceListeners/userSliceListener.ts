import { createListenerMiddleware } from "@reduxjs/toolkit";

import {
  setUserData,
  setUserId,
} from "@/shared/model/store/slices/userSlice/userSlice";
import { cryptusApi } from "@/shared/api/cryptusApi";

export const userSliceListener = createListenerMiddleware();

userSliceListener.startListening({
  actionCreator: setUserId,
  effect: async (action, listenerApi) => {
    try {
      const { data } = await listenerApi.dispatch(
        cryptusApi.endpoints.userList.initiate(
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
