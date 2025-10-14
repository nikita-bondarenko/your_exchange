import Icon from "@/shared/ui/media/Icon";
import clsx from "clsx"

type QuestionIconAnimationProps = {
    error?: boolean;
    className: string;
    wavesColor: string
}
export default function QuestionIconAnimation({ error, className, wavesColor }: QuestionIconAnimationProps) {
    return (
    <div className={clsx(className)}>
        <div className={clsx("relative opacity-0 transition-opacity duration-500", { "opacity-100": !error })}>
            <Icon
                src="question.svg"
                className={clsx(
                    "w-18 h-18  translate-x-[0.3px] translate-y-[0.5px]"
                )}
            ></Icon>
            <span style={{ borderColor: wavesColor }} className="absolute inset-[2px] rounded-full animation-wave-2 border   wave1"></span>
            <span style={{ borderColor: wavesColor }} className="absolute inset-[2px] rounded-full animation-wave-2 border    wave2"></span>
            <span style={{ borderColor: wavesColor }} className="absolute inset-[2px] rounded-full animation-wave-2 border   wave3"></span>
        </div>
    </div>
    )
}