import { CrossIcon } from "@/shared/ui";
import { SectionHeading } from "@/shared/ui/exchange";
import { FileInput } from "@/shared/ui/form/FileInput";
import { memo, useState } from "react";
import { LicenseAndInvoiceExampleNote } from "./LicenseAndInvoiceExampleNote";

export const LicenseAndInvoiceExampleInput = memo(() => {
  const [file1, setFile1] = useState<File>();
  const [file2, setFile2] = useState<File>();

  return (
    <div className="relative">
      <SectionHeading title="Лицензия компании <br/>и пример invoice" />
      <div className="flex gap-7">
        <FileInput onChange={setFile1} />
        <FileInput onChange={setFile2} />
      </div>
      <LicenseAndInvoiceExampleNote />
    </div>
  );
});

LicenseAndInvoiceExampleInput.displayName = "LicenseAndInvoiceExampleInput";
