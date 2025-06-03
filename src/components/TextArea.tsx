"use client";
import { Textarea as NextTextArea } from "@heroui/react";
import { ReactNode } from "react";

interface ITextAreaProps {
  className?: string
  name?: string
  size?: "sm" | "md" | "lg";
  label?: ReactNode | string;
  placeholder?: string;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  minRows?: number;
  maxRows?: number;
  error?: string;
  radius?: "sm" | "md" | "lg";
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  onBlur?:
    | ((e: React.FocusEvent<HTMLInputElement, Element>) => void)
    | undefined;
    isRequired?: boolean
}

export default function TextArea({
  error,
  label,
  maxRows,
  minRows,
  onBlur,
  onChange,
  onValueChange,
  placeholder,
  radius,
  size,
  value,
  variant = "bordered",
  name,
  isRequired,
  className
}: ITextAreaProps) {
  return (
    <NextTextArea
    style={{ whiteSpace: 'pre-line' }}
    className={`font-montserrat ${className}`}
    name={name}
    isRequired={isRequired}
      isClearable
      size={size}
      fullWidth
      label={label}
      placeholder={placeholder}
      variant={variant}
      onBlur={onBlur}
      onChange={onChange}
      errorMessage={error}
      isInvalid={Boolean(error)}
      onValueChange={onValueChange}
      maxRows={maxRows}
      minRows={minRows}
      radius={radius}
      value={value}
      labelPlacement="outside"

    />
  );
}
