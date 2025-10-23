import { RequisitesTextInput } from "@/shared/ui";
import { memo, useState } from "react";

const title = "Реквизиты компании за рубежом";
const placeholder = `Shenzhen Electronics Co., Ltd
Account number (IBAN): 
DE8937040040532013000
Bank: Deutsche Bank AG
SWIFT: DEUTDEFF
Bank address: Taunusanlage 12, 60325 Frankfurt am Main, Germany
Company address: 12 Nanshan Rd, Shenzhen, China`;

export const AbroadCompanyRequisitesInput = memo(() => {
  const [value, setValue] = useState("");
  return (
    <RequisitesTextInput
      title={title}
      placeholder={placeholder}
      value={value}
      setValue={setValue}
    />
  );
});

AbroadCompanyRequisitesInput.displayName = "AbroadCompanyRequisitesInput";
