import { BaseTextarea, RequisitesTextInput } from "@/shared/ui";
import { memo, useState } from "react";

const title = "Реквизиты компании в РФ";
const placeholder = `ООО «ТехноИмпорт»
ИНН: 7701234567
КПП: 770101001
Расчётный счёт: 40702810500000123456
Банк: ПАО «Сбербанк»
БИК: 044525225
Корр. счёт: 30101810400000000225
Юр. адрес: 109012, Москва, ул. Никольская, д. 10`;

export const RussianCompanyRequisitesInput = memo(() => {
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

RussianCompanyRequisitesInput.displayName = "RussianCompanyRequisitesInput";
