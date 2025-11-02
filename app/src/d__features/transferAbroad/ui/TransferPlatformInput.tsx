import { BaseTabs, SectionHeading } from "@/shared/ui";
import { useTransferDetailsOptions } from "../lib/useTransferDetailsOptions";
import { CurrencySubOption } from "@/shared/api";
import {
  setPlatform,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";

export const TransferPlatformInput: React.FC = () => {
  const { platforms } = useTransferDetailsOptions();

  const dispatch = useAppDispatch();

  const handleTabs = (value: CurrencySubOption) => {
    dispatch(setPlatform(value));
  };

  const platform = useAppSelector((state) => state.transferAbroad.platform);

  return (
    platform && (
      <div className="-mt-20">
        <SectionHeading title="Выберите платформу" />
        <BaseTabs value={platform} onChange={handleTabs} options={platforms} />
      </div>
    )
  );
};
