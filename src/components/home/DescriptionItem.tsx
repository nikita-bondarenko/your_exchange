import { memo, ReactNode } from "react";
import Icon from "../helpers/Icon";

const DescriptionItem: React.FunctionComponent<{
  icon: string;
  children: ReactNode;
}> = memo(({ icon, children }) => {

  return (
    <li className="rounded-full h-34 w-fit flex items-center justify-center px-17 gap-7 bg-[#FFEAD3] ">
      <Icon src={icon} className="w-20 h-20"></Icon>
      <span className="font-medium text-13 text-[#FB9325]">{children}</span>
    </li>
  );
});

DescriptionItem.displayName = "DescriptionItem"

export default DescriptionItem