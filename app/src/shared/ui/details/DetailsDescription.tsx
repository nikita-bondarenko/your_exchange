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
    <h3 className="text-[var(--text-light)] text-16 leading-normal mb-10">
      {title}
    </h3>
    <span
      dangerouslySetInnerHTML={{ __html: description }}
      className={clsx(
        "text-16 leading-[148%] text-[var(--text-main)]",
        descriptionClassName
      )}
    ></span>
  </div>
);
