"use client"
import { useCheckMailMutation } from "@/redux/api/cryptusApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setMailRequired } from "@/redux/slices/userSlice/userSlice";
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
