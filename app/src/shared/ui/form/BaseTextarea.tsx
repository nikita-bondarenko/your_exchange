import clsx from "clsx";

type BaseTextarea = {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  className?: string;
};
export const BaseTextarea = ({
  value,
  setValue,
  placeholder,
  className
}: BaseTextarea) => (
  <textarea
    className={clsx("min-h-158 w-full resize-none px-16 py-12 rounded-6 bg-[var(--background-secondary)] border border-[var(--border-placeholder)] text-[var(--text-main)] placeholder:text-[var(--text-light)]", className)}
    placeholder={placeholder}
    value={value}
    onChange={(e) => setValue(e.target.value)}
  ></textarea>
);
