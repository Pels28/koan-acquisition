"use client";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Input as NextInput } from "@heroui/react";
import { ReactNode, useState } from "react";
import clsx from "clsx";

interface InputProps {
  label: string;
  placeholder?: string;
  description?: ReactNode;
  isRequired?: boolean;
  type: "text" | "email" | "url" | "password" | "tel" | "search" | "file";
  labelPlacement: "inside" | "outside" | "outside-left";
  className?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  fullWidth?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  startContent?: ReactNode;
  endContent?: ReactNode;
  disabled?: boolean;
  readonly?: boolean;
  autoFocus?: boolean;
  rounded?: boolean;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  error?: string;
  min?: number;
  name?: string
  variant?: "bordered" | "flat" | "underlined" | "faded"
}

const Input = ({
  label,
  placeholder,
  className,
  description,
  isRequired,
  type = "text",
  labelPlacement = "outside",
  size = "lg",
  radius = "sm",
  fullWidth,
  value,
  onChange,
  startContent,
  defaultValue,
  disabled,
  readonly,
  autoFocus,
  error,
  onBlur,
  onFocus,
  onValueChange,
  min,
  endContent,
  name,
  variant
}: InputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <NextInput
    name={name}
      disabled={disabled}
      classNames={{ inputWrapper: clsx({ "border-gray border-2" :variant != "underlined"}) }}
      className={`font-montserrat ${className}`}
      label={label}
      placeholder={placeholder}
      description={description}
      isRequired={isRequired}
      type={type == "password" && isVisible ? "text" : type}
      labelPlacement={labelPlacement}
      size={size}
      radius={radius}
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      startContent={startContent}
      variant={variant}
      endContent={
        type == "password" ? (
          <span className="cursor-pointer" onClick={toggleVisibility}>
            {isVisible ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </span>
        ) : (
          endContent
        )
      }
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onFocus={(e) => {
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        if (onBlur) {
          onBlur(e);
        }
      }}
      errorMessage={error}
      isInvalid={Boolean(error)}
      min={min}
      autoFocus={autoFocus}
      readOnly={readonly}
    />
  );
};

export default Input;
