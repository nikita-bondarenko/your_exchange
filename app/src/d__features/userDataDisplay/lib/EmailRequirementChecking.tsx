"use client";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setMailRequired } from "@/d__features/userDataDisplay/model/store/reducer/userReducer";
import React, { startTransition, useEffect } from "react";
import { checkMailRequirementAction } from "../api";

export function EmailRequirementChecking() {
  const userId = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userId) {
      startTransition(async () => {
        const res = await checkMailRequirementAction({ user_id: userId});
        if (res.mail_required) dispatch(setMailRequired(true));
      });
    }
  }, [userId]);
  return <></>;
}
