import { createListenerMiddleware } from "@reduxjs/toolkit";

import { setUserData, setUserId } from "@/redux/slices/userSlice/userSlice";
import { cryptusApi } from "@/redux/api/cryptusApi";

export const userSliceListener = createListenerMiddleware();

userSliceListener.startListening({
  actionCreator: setUserId,
  effect: async (action, listenerApi) => {
    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.userList.initiate(
        {
          userId: action.payload,
        },
        { forceRefetch: true }
      )
    );
    // console.log("userSliceListener", data);
    if (data) {
      listenerApi.dispatch(setUserData(data));
    }
  },
});
