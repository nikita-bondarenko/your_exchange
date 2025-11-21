import { memo, useEffect, useMemo } from "react";
import { TransferSelectItem } from "./TransferSelectItem";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import { sortArrayByProperty, useServerAction } from "@/shared/lib";
import {
  setGetTransferOptionsLoading,
  setSelectedTranserTypeOptionId,
} from "../../model";
import { getTransferOptionsAction } from "../../api";

export const TransferSelect = memo(() => {
  const [getTransferOptions, getTransferOptionsResponse] = useServerAction({
    action: getTransferOptionsAction,
    loadingAction: setGetTransferOptionsLoading,
  });

  useEffect(() => {
    getTransferOptions(undefined);
  }, []);

  const parsedData = useMemo(() => {
    const copiedObject = { ...getTransferOptionsResponse };

    const categories: ("individual" | "legal_entity")[] = [
      "individual",
      "legal_entity",
    ];
    categories.forEach((category) => {
      if (
        copiedObject &&
        copiedObject[category] &&
        Array.isArray(copiedObject[category])
      )
        copiedObject[category] = sortArrayByProperty({
          array: copiedObject[category],
          propertyName: "weight",
        });
    });

    return copiedObject;
  }, [getTransferOptionsResponse]);

  const selectedTranserTypeOptionId = useAppSelector(
    (state) => state.transferAbroad.selectedTranserTypeOptionId
  );

  const transferTypeCategory = useAppSelector(
    (state) => state.transferAbroad.transferTypeCategory
  );

  const transferTypeOptions = useMemo(() => {
    return transferTypeCategory && parsedData
      ? parsedData[transferTypeCategory]
      : [];
  }, [transferTypeCategory, parsedData]);

  const dispatch = useAppDispatch();

  const handleSelect = (id: number) => {
    dispatch(setSelectedTranserTypeOptionId(id));
  };

  useEffect(() => {
    if (
      parsedData &&
      transferTypeCategory &&
      parsedData[transferTypeCategory] &&
      parsedData[transferTypeCategory][0]
    ) {
      const id = parsedData[transferTypeCategory][0].id;
      dispatch(setSelectedTranserTypeOptionId(id));
    }
  }, [parsedData, transferTypeCategory]);

  return (
    <div className="overflow-hidden rounded-6 bg-[var(--background-secondary)] border border-[var(--border-placeholder)]">
      {transferTypeOptions?.map((type) => (
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
