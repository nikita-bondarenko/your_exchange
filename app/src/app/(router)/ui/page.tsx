"use client";

import { TransferCurrencyInput } from "@/c__widgets/transferCurrencyInput/ui";
import { ModeSwitcher } from "@/d__features/modeSwitcher/ui";
import { TransferTypeSwitcher } from "@/d__features/transferTypeSwitcher/ui";
import { AbroadCompanyRequisitesInput } from "@/entities/abroadCompanyRequisitesInput/ui";
import { LicenseAndInvoiceExampleInput } from "@/entities/licenseAndInvoiceExampleInput/ui/LicenseAndInvoiceExampleInput";
import { RussianCompanyRequisitesInput } from "@/entities/russianCompanyRequisitesInput/ui";
import { TaskDescriptionInput } from "@/entities/taskDescriptionInput/ui";
import { TransferSelect } from "@/entities/transferSelect/ui";

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
