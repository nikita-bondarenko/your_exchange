"use client";
import { useFormContext } from "react-hook-form";
import React from "react";
import clsx from "clsx";
import { InputWrapper } from "./InputWrapper";

type Props = {
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  trackingLabel: string;
};

export const ProfileInputField: React.FC<Props> = ({
  name,
  type = "text",
  placeholder,
  value,
  disabled = false,
  trackingLabel
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper error={errors[name]?.message as string}>
      <input
        data-tracking-label={trackingLabel}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={clsx(
          "w-full text-[var(--text-main)] bg-[var(--background-secondary)] text-16 leading-normal rounded-6 px-18 py-14 placeholder:text-[var(--text-light)] border border-[var(--border-placeholder)]",
          {
            "opacity-50 cursor-not-allowed": disabled,
          }
        )}
      />
    </InputWrapper>
  );
};
