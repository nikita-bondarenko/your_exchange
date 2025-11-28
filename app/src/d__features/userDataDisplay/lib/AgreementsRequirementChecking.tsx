"use client";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setAgreementAccepted } from "@/d__features/userDataDisplay/model/store/reducer/userReducer";
import { redirect, usePathname } from "next/navigation";
import React, { startTransition, useEffect } from "react";
import { checkConsentRequirementAction } from "../api";

export function AgreementsRequirementChecking() {
  const path = usePathname();
  const userId = useAppSelector((state) => state.user.id);
  const agreementAccepted = useAppSelector(
    (state) => state.user.agreementAccepted
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId)
      startTransition(async () => {
        const res = await checkConsentRequirementAction({ user_id: userId });
        if (res.consent_required) dispatch(setAgreementAccepted(false));
      });
  }, [userId]);

  useEffect(() => {
    if (!agreementAccepted && path !== "/") {
      redirect("/");
    }
  }, [path, agreementAccepted]);
  return <></>;
}
