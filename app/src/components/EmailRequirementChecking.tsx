import { useCheckMailMutation } from "@/redux/api/cryptusApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setMailRequired } from "@/redux/slices/userSlice/userSlice";
import React, { ReactNode, useEffect } from "react";

type Props = {};

export default function EmailRequirementChecking({}: Props) {
  const userId = useAppSelector((state) => state.user.id);
  const [checkMail] = useCheckMailMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userId) {
      checkMail({ user_id: userId || 0 }).then((res) => {
        console.log('res.data?.mail_request',res.data?.mail_request)
        if (res.data?.mail_request)
        dispatch(setMailRequired(true));
      });
    }
  }, [userId]);
  return <></>;
}
