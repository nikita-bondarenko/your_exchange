import clsx from "clsx";
import Button from "../button/Button";
import Icon from "../media/Icon";
import { createPortal } from "react-dom";
import { ForwardedRef, forwardRef, useEffect, useRef } from "react";

type BaseModalProps = {
  mode: "dark" | "light";
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  handleButton?: () => void;
  buttonText?: string;
  lightBackgroundClass?: string;
  isCloseButtonHidden?: boolean;
  className?: string;
  isSubmitButtonDisabled?: boolean;
  renderTrigger?: number;
};

const BaseModal = forwardRef(
  (
    {
      mode,
      children,
      isOpen,
      handleClose,
      handleButton,
      buttonText = "Понятно!",
      lightBackgroundClass = "bg-white",
      isCloseButtonHidden = false,
      className,
      isSubmitButtonDisabled,
      renderTrigger,
    }: BaseModalProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const portalTarget = useRef<HTMLElement>(null);

    useEffect(() => {
      portalTarget.current = document.getElementById("portal-target");
    }, [renderTrigger]);

    const element = (
      <div
        ref={ref}
        onClick={handleClose}
        className={clsx(
          "fixed top-0 left-0 w-full h-full bg-[#4e4e4e]/60 flex justify-center items-center transition-all duration-500 z-[200] p-[21px]",
          {
            "pointer-events-none opacity-0": !isOpen,
            "pointer-events-auto opacity-100": isOpen,
          },
          className
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            " relative w-full max-w-[400px] rounded-[16px] p-[28px] pt-[36px] flex flex-col gap-[30px]",
            mode === "dark" ? "bg-[#303030]" : lightBackgroundClass
          )}
        >
          <div
            className={clsx(
              " text-[16px] ",
              mode === "dark" ? "text-white" : "text-black"
            )}
          >
            {children}
          </div>
          <Button
            disabled={isSubmitButtonDisabled}
            type="primary"
            onClick={handleButton || handleClose}
          >
            {buttonText}
          </Button>
          {!isCloseButtonHidden && (
            <button
              className="absolute top-[19px] right-[17px]"
              onClick={handleClose}
            >
              {" "}
              <Icon src="close.svg" className={clsx("w-13 h-13")} />
            </button>
          )}
        </div>
      </div>
    );
    return portalTarget.current
      ? createPortal(element, portalTarget.current)
      : null;
  }
);

BaseModal.displayName = "BaseModal"

export default BaseModal;;
