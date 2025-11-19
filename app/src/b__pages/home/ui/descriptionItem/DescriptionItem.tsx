import { memo, ReactNode } from "react";

const DescriptionItem: React.FunctionComponent<{
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}> = memo(({ icon, children, className }) => {
  return (
    <li
      style={{ background: "var(--background-first-screen-description)" }}
      className={`rounded-full h-[31px] w-fit flex items-center justify-center px-14 gap-7 `}
    >
      <div className={className}>{icon}</div>
      <span className="font-medium text-12 text-[var(--text-main-screen-description)]">
        {children}
      </span>
    </li>
  );
});

DescriptionItem.displayName = "DescriptionItem";

export default DescriptionItem;
