"use client";

import { TransferCurrencyInput } from "@/d__features/transferAbroad/ui/transferCurrencyInput/ui";
import { ModeSwitcher } from "@/d__features/modeSwitcher/ui";
import { TransferTypeSwitcher } from "@/d__features/transferTypeSwitcher/ui";
import { AbroadCompanyRequisitesInput } from "@/entities/abroadCompanyRequisitesInput/ui";
import { LicenseAndInvoiceExampleInput } from "@/d__features/transferAbroad/ui/licenseAndInvoiceExampleInput/LicenseAndInvoiceExampleInput";
import { RussianCompanyRequisitesInput } from "@/entities/russianCompanyRequisitesInput/ui";
import { TaskDescriptionInput } from "@/entities/taskDescriptionInput/ui";
import { TransferSelect } from "@/d__features/transferAbroad/ui/transferSelect/ui";

export default function Page() {
  return (
    <div className=" flex flex-col gap-[50px] container">
      <ModeSwitcher></ModeSwitcher>
      <TransferTypeSwitcher></TransferTypeSwitcher>
      <TransferSelect></TransferSelect>
      <TaskDescriptionInput></TaskDescriptionInput>
      <AbroadCompanyRequisitesInput></AbroadCompanyRequisitesInput>
      <RussianCompanyRequisitesInput></RussianCompanyRequisitesInput>
      <LicenseAndInvoiceExampleInput></LicenseAndInvoiceExampleInput>
      {/* <TransferCurrencyInput/> */}
    </div>
  );
}
