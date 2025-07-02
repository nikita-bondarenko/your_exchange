import clsx from "clsx";
import { memo } from "react";
import Icon from "../helpers/Icon";

const RequestStatus: React.FunctionComponent<{
  isInProcess: boolean;
  id: string;
}> = memo(({ isInProcess, id }) => {
  return (
    <div
      className={clsx("transition-all select-none w-full", {
        " opacity-100 ": isInProcess,
      })}
    >
      <div className="px-17 pt-14 pb-16 rounded-8 flex items-center gap-11 w-full bg-[#FFEAD3]">
        <Icon src="clock.svg" className="w-30 h-30"></Icon>
        <div>
          <p className="text-13 mb-4 text-[#FB9325]">Заявка {id} в работе</p>
          <span className="text-10 text-[#BFBFBF] leading-[120%] block">
            Наш оператор скоро с вами свяжется
          </span>
        </div>
      </div>
    </div>
  );
});

RequestStatus.displayName = "RequestStatus"

export default RequestStatus