"use client"
import { useCheckMailMutation } from "@/shared/api/cryptusApi";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setMailRequired } from "@/shared/model/store/reducers/userReducer";
import React, { ReactNode, useEffect } from "react";


export default function EmailRequirementChecking() {
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
