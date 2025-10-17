import { memo, ReactNode } from "react";

const DescriptionItem: React.FunctionComponent<{
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}> = memo(({ icon, children, className }) => {

  return (
    <li className={`rounded-full h-[31px] w-fit flex items-center justify-center px-14 gap-7 bg-[var(--background-first-screen-description)] `}>
      <div className={className}>
        {icon}
        {/* <Icon src={icon} className="w-full h-full [&_*]:stroke-[var(--text-main-screen-description)] [&_*]:fill-[var(--text-main-screen-description)]"></Icon> */}
      </div>
      <span className="font-medium text-12 text-[var(--text-main-screen-description)]">{children}</span>
    </li>
  );
});

DescriptionItem.displayName = "DescriptionItem"

export default DescriptionItem