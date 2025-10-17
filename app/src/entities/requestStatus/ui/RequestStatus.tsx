import { ClockIcon } from "@/shared/ui";
import clsx from "clsx";
import { memo } from "react";

const RequestStatus: React.FunctionComponent<{
  isInProcess: boolean;
  id: string | undefined;
}> = memo(({ isInProcess, id }) => {
  return (
    <div
      className={clsx("transition-all select-none w-full", {
        " opacity-100 ": isInProcess,
      })}
    >
      <div className="px-17 pt-14 pb-16 rounded-8 flex items-center gap-11 w-full bg-[var(--background-request-status)]">
        <ClockIcon className="w-30 h-30"></ClockIcon>
        <div>
          <p className="text-13 mb-4 text-[var(--text-main)]">Заявка {id} в работе</p>
          <span className="text-10 text-[var(--text-secondary)] leading-[120%] block">
            Наш оператор скоро с вами свяжется
          </span>
        </div>
      </div>
    </div>
  );
});

RequestStatus.displayName = "RequestStatus"

export default RequestStatus