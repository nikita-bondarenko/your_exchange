"use client";

import ProcessLayout from "@/c__widgets/processLayout/ui";
import {
  LicenseAndInvoiceExampleInput,
  RussianCompanyRequisitesInput,
  AbroadCompanyRequisitesInput,
} from "@/d__features/transferAbroad/ui";
import { useRouterPushCallback } from "@/shared/lib";

export default function TransferAbroadInputFtaRequisitesAndLicense() {
  const [handleSubmit] = useRouterPushCallback("/transfer-abroad/confirmation");
  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <AbroadCompanyRequisitesInput></AbroadCompanyRequisitesInput>
      <RussianCompanyRequisitesInput></RussianCompanyRequisitesInput>
      <LicenseAndInvoiceExampleInput></LicenseAndInvoiceExampleInput>
    </ProcessLayout>
  );
}
