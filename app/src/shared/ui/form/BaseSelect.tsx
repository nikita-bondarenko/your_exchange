import React, { memo, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export type BaseSelectProps<T> = {
  options: T[];
  onChange: (value: T) => void;
  value: T | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  renderTrigger: (props: {
    isOpen: boolean;
    onClick: () => void;
    value: T | null;
  }) => React.ReactNode;
  renderOption: (props: {
    index: number
    option: T;
    onClick: () => void;
  }) => React.ReactNode;
  filterOptions?: (options: T[], searchValue: string) => T[];
  searchValue?: string;
  maxHeight?: number;
  className?: string;
  dropdownClassName?: string;
  dropdownTop?: string;
};

export const _BaseSelect = memo(<T,>({
  options,
  onChange,
  value,
  isOpen,
  onOpenChange,
  renderTrigger,
  renderOption,
  filterOptions,
  searchValue = "",
  maxHeight = 134,
  className = "",
  dropdownClassName = "",
  dropdownTop = "top-59",
}: BaseSelectProps<T>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onOpenChange]);

  const filteredOptions = filterOptions ? filterOptions(options, searchValue) : options;

  return (
    <div className={`relative w-full shrink-0 ${className}`} ref={dropdownRef}>
      {renderTrigger({
        isOpen,
        onClick: () => onOpenChange(!isOpen),
        value,
      })}

      {isOpen && (
        <div  className={`absolute left-0 ${dropdownTop} mt-1 w-full z-50 bg-[var(--background-secondary)] border border-[var(--border-placeholder)] rounded-6  overflow-hidden ${dropdownClassName}`}>
          <SimpleBar style={{ maxHeight }} className="custom-scrollbar">
            <div className="flex flex-col py-6 gap-0">
              {filteredOptions.length === 0 ? (
                <div className="px-18 py-9 text-16 text-[var(--text-light)]">
                  ничего не нашлось
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <React.Fragment key={index}>
                    {renderOption({
                      index,
                      option,
                      onClick: () => {
                        onChange(option);
                        onOpenChange(false);
                      },
                    })}
                  </React.Fragment>
                ))
              )}
            </div>
          </SimpleBar>
        </div>
      )}
    </div>
  );
});

_BaseSelect.displayName = "BaseSelect"


export const BaseSelect = _BaseSelect as <T,>(
  props: BaseSelectProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => ReturnType<typeof _BaseSelect>