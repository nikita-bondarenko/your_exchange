import React from 'react';
import clsx from 'clsx';

const InputField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, onChange, onBlur, error, placeholder, disabled }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur();
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full rounded-6 border bg-black px-19 py-26 text-16 leading-normal placeholder:text-neutral-gray-400",
          "focus:outline-none focus:border-neutral-blue-100",
          "disabled:bg-neutral-gray-100 disabled:cursor-not-allowed",
          {
            "border-neutral-gray-200": !error,
            "border-primary-red": error,
          }
        )}
      />
      {error && (
        <span className={clsx(
          "absolute right-19 top-1/2 -translate-y-1/2 text-neutral-gray-400",
          "peer-focus:text-neutral-blue-100"
        )}>
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField; 