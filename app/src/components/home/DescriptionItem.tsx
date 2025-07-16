import { memo, ReactNode } from "react";
import Icon from "../helpers/Icon";

const DescriptionItem: React.FunctionComponent<{
  icon: string;
  children: ReactNode;
  className?: string;
}> = memo(({ icon, children, className }) => {

  return (
    <li className={`rounded-full h-[31px] w-fit flex items-center justify-center px-17 gap-7 bg-[#EBEBEB] `}>
      <div className={className}>
        <Icon src={icon} className="w-full h-full"></Icon>
      </div>
      <span className="font-medium text-13 text-[#404040]">{children}</span>
    </li>
  );
});

DescriptionItem.displayName = "DescriptionItem"

export default DescriptionItem