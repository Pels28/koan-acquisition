import { CalendarDate, DatePicker as NextDatePicker } from "@heroui/react";
import { ReactNode } from "react";

interface IDatePickerProps {
  name?: string;
  className?: string;
  label?: string | ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  variants?: "flat" | "bordered" | "underlined" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  error?: string;
  value?: CalendarDate | undefined | null;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "lg" | "full";
  onChange?: ((value: CalendarDate | null) => void) | undefined;
  onFocus?: ((e: React.FocusEvent<Element, Element>) => void) | undefined;
  onBlur?: ((e: React.FocusEvent<Element, Element>) => void) | undefined;
  onFocusChange?: (isFocused: boolean) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
}

export default function DatePicker({
  name,
  className,
  error,
  isDisabled,
  isReadOnly,
  isRequired,
  label,
  labelPlacement,
  onBlur,
  onChange,
  onFocus,
  onFocusChange,
  radius,
  size,
  value,
  variants,
}: IDatePickerProps) {
  const calendarValue = value || null
  return (

    
    <NextDatePicker
      classNames={{ inputWrapper: ["border-gray", "border-2"] }}
      name={name}
      showMonthAndYearPickers
      className={`font-montserrat ${className}`}
      label={label}
      errorMessage={error}
      isInvalid={Boolean(error)}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      value={calendarValue}
      variant={variants}
      size={size}
      radius={radius}
      isRequired={isRequired}
      labelPlacement={labelPlacement}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onFocusChange={onFocusChange}
    />
  );
}
