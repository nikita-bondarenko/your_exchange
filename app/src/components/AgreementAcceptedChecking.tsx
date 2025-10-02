"use client"
import { useCheckConsentMutation } from "@/redux/api/cryptusApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAgreementAccepted } from "@/redux/slices/userSlice/userSlice";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function AgreementAcceptedChecking() {
  const path = usePathname();
  const userId = useAppSelector((state) => state.user.id);
  const agreementAccepted = useAppSelector(
    (state) => state.user.agreementAccepted
  );
  const dispatch = useAppDispatch();
  const [fetchIsConsented] = useCheckConsentMutation();

  useEffect(() => {
    if (userId)
      fetchIsConsented({ user_id: userId }).then((res) => {
        if (res.data?.consent_required) dispatch(setAgreementAccepted(false));
      });
  }, [userId]);

  useEffect(() => {
    if (!agreementAccepted && path !== "/") {
      redirect("/");
    }
  }, [path, agreementAccepted]);
  return <></>;
}
