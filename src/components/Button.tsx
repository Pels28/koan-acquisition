"use client";
import { Button as NextButton, PressEvent } from "@heroui/react";
import { JSX, ReactElement, ReactNode } from "react";

interface ButtonProps {
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  radius?: "full" | "lg" | "md" | "sm" | "none";
  color?: "default" | "primary" | "secondary" | "danger";
  isIconOnly?: boolean;
  children?: ReactNode | ReactElement | JSX.Element;
  isLoading?: boolean;
  fullWidth?: boolean;
  onPress?: (e: PressEvent) => void;
  type?: "submit" | "reset" | "button"
  variant?: "solid" | "faded" | "bordered" | "light" | "flat" | "ghost"
  className?: string
  startContent?: ReactNode | ReactElement | JSX.Element;
  endContent?: ReactNode | ReactElement | JSX.Element;

}

export default function Button({
  size,
  isDisabled,
  radius,
  color,
  isIconOnly,
  isLoading,
  fullWidth,
  onPress,
  children,
  type,
  variant,
  className,
  startContent,
  endContent
}: ButtonProps) {
  return (
    <NextButton
      color={color}
      startContent={startContent}
      endContent={endContent}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isIconOnly={isIconOnly}
      size={size}
      fullWidth={fullWidth}
      onPress={onPress}
      className={`font-montserrat ${className} `}
      radius={radius}
      type={type}
      variant={variant}
    >
      {children}
    </NextButton>
  );
}
