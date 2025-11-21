import { BaseTabs, SectionHeading } from "@/shared/ui";
import { useTransferDetailsOptions } from "../lib/useTransferDetailsOptions";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import { setPlatform } from "../model";
import { CurrencySubOption } from "@/shared/model/api";

export const TransferPlatformInput: React.FC = () => {
  const { platforms } = useTransferDetailsOptions();

  const dispatch = useAppDispatch();

  const handleTabs = (value: CurrencySubOption) => {
    dispatch(setPlatform(value));
  };

  useEffect(() => {
    if (platforms.length > 0) {
      dispatch(setPlatform(platforms[0]));
    }
  }, [platforms]);

  const platform = useAppSelector((state) => state.transferAbroad.platform);

  return (
    <div className="-mt-20">
      <SectionHeading title="Выберите платформу" />
      <BaseTabs value={platform} onChange={handleTabs} options={platforms} />
    </div>
  );
};
