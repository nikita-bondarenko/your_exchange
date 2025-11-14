import { BankSelect } from "@/entities/bank/ui";
import { memo, useEffect } from "react";
import { useTransferDetailsOptions } from "../lib/useTransferDetailsOptions";
import { useBankInputError } from "../lib/useBankInputError";
import { useAppSelector, useAppDispatch } from "@/shared/model/store";
import { CurrencySubOption } from "../api";
import { setBank } from "../model";

export const TransferBankSelect = memo(() => {
  const { banks } = useTransferDetailsOptions();
  const bank = useAppSelector((state) => state.transferAbroad.bank);
  const dispatch = useAppDispatch();
  const handleSelect = (value: CurrencySubOption | null) => {
    if (value) dispatch(setBank(value));
  };

  const { bankInputError } = useBankInputError();

  return (
    <div className="-mt-26">
      <BankSelect
        placeholder="Выберите банк получения"
        value={bank}
        options={banks}
        onChange={handleSelect}
        error={bankInputError}
      ></BankSelect>
    </div>
  );
});

TransferBankSelect.displayName = "TransferBankSelect";
