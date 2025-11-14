"use client"
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setMailRequired } from "@/d__features/userDataDisplay/model/store/reducer/userReducer";
import React, { useEffect } from "react";
import { useCheckMailMutation } from "../api";


export  function EmailRequirementChecking() {
  const userId = useAppSelector((state) => state.user.id);
  const [checkMail] = useCheckMailMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userId) {
      checkMail({ user_id: userId || 0 }).then((res) => {
        if (res.data?.mail_required)
        dispatch(setMailRequired(true));
      });
    }
  }, [userId]);
  return <></>;
}
