"use client";

import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { exchangeSliceListener, store, userSliceListener, validateListener } from "@/shared/model/store";

export function StoreProvider({ children }: PropsWithChildren) {

  return <Provider store={store}>{children}</Provider>;
}
