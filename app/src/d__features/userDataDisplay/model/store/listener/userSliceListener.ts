import { createListenerMiddleware } from "@reduxjs/toolkit";

import {
  setUserData,
  setUserId,
} from "@/d__features/userDataDisplay/model/store/reducer/userReducer";
import { userApi } from "@/d__features/userDataDisplay/api";

export const userSliceListener = createListenerMiddleware();

userSliceListener.startListening({
  actionCreator: setUserId,
  effect: async (action, listenerApi) => {
    // try {
    //   const { data } = await listenerApi.dispatch(
    //     userApi.endpoints.userList.initiate(
    //       {
    //         userId: action.payload,
    //       },
    //       { forceRefetch: true }
    //     )
    //   );

    //   if (data) {
    //     console.log(data)
    //     listenerApi.dispatch(setUserData(data));
    //   }
    // } catch (e) {
    //   console.error(e)
    // }
  },
});
