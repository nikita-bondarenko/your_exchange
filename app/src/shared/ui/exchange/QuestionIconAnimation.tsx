import clsx from "clsx";
import { QuestionIcon } from "../icon";

type QuestionIconAnimationProps = {
  error?: boolean;
  className: string;
};
export default function QuestionIconAnimation({
  error,
  className,
}: QuestionIconAnimationProps) {
  return (
    <div className={clsx(className)}>
      <div
        className={clsx("relative opacity-0 transition-opacity duration-500", {
          "opacity-100": !error,
        })}
      >
        <QuestionIcon
          color={"var(--main-color)"}
          className={clsx("w-18 h-18  translate-x-[0.3px] translate-y-[0.5px]")}
        ></QuestionIcon>
        <span
          style={{ borderColor: "var(--main-color)" }}
          className="absolute inset-[2px] rounded-full animation-wave-2 border wave1"
        ></span>
        <span
          style={{ borderColor: "var(--main-color)" }}
          className="absolute inset-[2px] rounded-full animation-wave-2 border wave2"
        ></span>
        <span
          style={{ borderColor: "var(--main-color)" }}
          className="absolute inset-[2px] rounded-full animation-wave-2 border wave3"
        ></span>
      </div>
    </div>
  );
}
