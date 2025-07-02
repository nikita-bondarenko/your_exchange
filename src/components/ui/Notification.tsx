import clsx from "clsx";
import Icon from "../helpers/Icon";

type NotificationProps = {
  isVisible: boolean;
  message: string;
  iconSrc?: string;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  isVisible,
  message,
  className,
  iconSrc = "sign.svg",
}) => {
  return (
    <div>
      <div
        className={clsx(
          "flex items-center justify-center gap-8 text-16 h-56 opacity-0 transition-opacity duration-500 bg-white rounded-6 border-1 border-transparent pointer-events-none text-black",
          { "opacity-100 pointer-events-auto": isVisible },
          className
        )}
      >
        <Icon src={iconSrc} className="w-12 h-12 translate-y-2" />
        {message}
      </div>
    </div>
  );
}; 