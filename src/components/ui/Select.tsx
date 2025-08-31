import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  disabled = false,
  className = "",
  isLoading = false,
}: SelectProps) {
  // Filter out empty string values as Radix UI doesn't allow them
  const validOptions = options.filter((option) => option.value !== "");

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
    >
      <SelectPrimitive.Trigger
        className={`
          inline-flex items-center justify-between
          h-10 px-3 py-2
          rounded-md border border-gray-300 bg-white
          text-sm text-gray-900 shadow-sm
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:opacity-50
          hover:border-gray-400
          transition-colors duration-200
          ${className}
        `}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="ml-2 h-4 w-4 text-gray-500">
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <SelectPrimitive.Viewport className="p-1">
            {validOptions.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={`
                  relative flex cursor-pointer select-none items-center
                  rounded-sm px-2 py-1.5 text-sm text-gray-900
                  outline-none
                  hover:bg-blue-50 hover:text-blue-900
                  focus:bg-blue-50 focus:text-blue-900
                  data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-900
                  transition-colors duration-150
                `}
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

// Export the primitive for advanced use cases
export { SelectPrimitive };
