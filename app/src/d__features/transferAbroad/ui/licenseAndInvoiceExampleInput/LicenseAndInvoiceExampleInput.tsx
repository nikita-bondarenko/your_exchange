import { CrossIcon } from "@/shared/ui";
import { SectionHeading } from "@/shared/ui/exchange";
import { FileInput } from "@/shared/ui/form/FileInput";
import { memo, useState } from "react";
import { LicenseAndInvoiceExampleNote } from "./LicenseAndInvoiceExampleNote";
import { setFile1, setFile2, useAppDispatch, useAppSelector } from "@/shared/model/store";
import { stat } from "fs";

export const LicenseAndInvoiceExampleInput = memo(() => {
  const file1 = useAppSelector((state) => state.transferAbroad.file1);
  const file2 = useAppSelector((state) => state.transferAbroad.file2);

  const dispatch = useAppDispatch();

  const handleFile1Input = (file: File) => {
    dispatch(setFile1(file));
  };

  const handleFile2Input = (file: File) => {
    dispatch(setFile2(file));
  };

  return (
    <div className="relative">
      <SectionHeading title="Лицензия компании <br/>и пример invoice" />
      <div className="flex gap-7">
        <FileInput value={file1} onChange={handleFile1Input} />
        <FileInput value={file2} onChange={handleFile2Input} />
      </div>
      <LicenseAndInvoiceExampleNote />
    </div>
  );
});

LicenseAndInvoiceExampleInput.displayName = "LicenseAndInvoiceExampleInput";
