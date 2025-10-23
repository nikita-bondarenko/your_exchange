import clsx from "clsx";

type Props = {
  title: string;
  description: string;
  descriptionClassName?: string;
};
export const DetailsDescription = ({
  title,
  description,
  descriptionClassName,
}: Props) => (
  <div>
    <h3 className="text-[var(--text-light)] text-13 leading-normal mb-10">
      {title}
    </h3>
    <span
      className={clsx(
        "break-all text-16  leading-[148%] text-[var(--text-main)]",
        descriptionClassName
      )}
    >
      {description}
    </span>
  </div>
);
