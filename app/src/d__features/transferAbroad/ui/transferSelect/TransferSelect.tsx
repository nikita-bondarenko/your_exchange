import { memo, useEffect, useMemo, useState } from "react";
import { TransferSelectItem, TransferType } from "./TransferSelectItem";
import { TransferOption, useGetTransferOptionsQuery } from "@/shared/api";
import {
  setSelectedTranserTypeOptionId,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";

export const TransferSelect = memo(() => {
  const { data } = useGetTransferOptionsQuery();

  const selectedTranserTypeOptionId = useAppSelector(
    (state) => state.transferAbroad.selectedTranserTypeOptionId
  );

  const transferTypeCategory = useAppSelector(
    (state) => state.transferAbroad.transferTypeCategory
  );

  const transferTypeOptions = useMemo(() => {
    return transferTypeCategory && data ? data[transferTypeCategory] : [];
  }, [transferTypeCategory, data]);

  const dispatch = useAppDispatch();

  const handleSelect = (id: number) => {
    dispatch(setSelectedTranserTypeOptionId(id));
  };

  useEffect(() => {
    if (data && transferTypeCategory) {
      const id = data[transferTypeCategory][0].id;
      dispatch(setSelectedTranserTypeOptionId(id));
    }
  }, [data, transferTypeCategory]);

  return (
    <div className="overflow-hidden rounded-6 bg-[var(--background-secondary)] border border-[var(--border-placeholder)]">
      {transferTypeOptions.map((type) => (
        <TransferSelectItem
          key={type.id}
          {...type}
          isSelected={type.id === selectedTranserTypeOptionId}
          onClick={() => handleSelect(type.id)}
        ></TransferSelectItem>
      ))}
    </div>
  );
});

TransferSelect.displayName = "TransferSelect";
