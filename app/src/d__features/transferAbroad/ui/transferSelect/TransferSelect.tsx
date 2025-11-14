import { memo, useEffect, useMemo } from "react";
import { TransferSelectItem } from "./TransferSelectItem";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { sortArrayByProperty } from "@/shared/lib";
import { useGetTransferOptionsQuery } from "../../api";
import { setSelectedTranserTypeOptionId } from "../../model";

export const TransferSelect = memo(() => {
  const { data } = useGetTransferOptionsQuery();

  const parsedData = useMemo(() => {
    const copiedObject = { ...data };

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

    console.log(data, copiedObject)

    return copiedObject;
  }, [data]);

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
      parsedData[transferTypeCategory]
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
