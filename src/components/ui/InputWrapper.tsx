import React from "react";
import clsx from "clsx";
import Icon from "../helpers/Icon";

type InputWrapperProps = {
  children: React.ReactElement<{ className?: string }>;
  error?: string | null;
  className?: string;
  errorClassName?: string;
  errorIconClassName?: string;
  errorTextClassName?: string;
  errorIcon?: boolean;
  showErrorText?: boolean;
};

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  error,
  className,
  errorClassName = "text-primary-red text-13",
  errorIconClassName = "w-16 h-16 absolute right-12 top-14",
  errorTextClassName = "absolute left-0 -bottom-1",
  errorIcon = true,
  showErrorText = true,
}) => {
  return (
    <div className={clsx("w-full pb-16 relative", className)}>
      {React.cloneElement(children, {
        className: clsx(children.props.className, {
          "[&]:border-primary-red": error ,
        }),
      })}
           {showErrorText && <p className={clsx(errorTextClassName, errorClassName, 'transition-all duration-500', {"opacity-0": !error})}>
            {error}
          </p>}
          {errorIcon && (
            <div className={clsx("absolute right-0 top-0 h-full flex items-center pr-12 transition-all duration-500", {"opacity-0": !error})}>
              <Icon
                src="alert.svg"
                className={errorIconClassName}
              />
            </div>
          )}
      {error && (
        <>
    
         
        </>
      )}
    </div>
  );
}; 