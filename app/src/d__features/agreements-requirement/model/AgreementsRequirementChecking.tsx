"use client"
import { useCheckConsentMutation } from "@/shared/api/cryptusApi";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setAgreementAccepted } from "@/shared/model/store/slices/userSlice/userSlice";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function AgreementsRequirementChecking() {
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
