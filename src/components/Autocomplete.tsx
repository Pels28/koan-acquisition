"use client";
import React, { Key, ReactNode } from "react";
import {
  Autocomplete as NextAutocomplete,
  AutocompleteItem,
} from "@heroui/react";

interface IAutoconpleteProps {
  error?: string;
  onInputChange: (value: string) => void;
  onSelectionChanege: (id: Key | null) => void;
  items: { label: string; key: string; description: string }[];
  className?: string;
  label: string | ReactNode;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  inputValue?: string;
  shouldCloseOnBlur?: boolean;
  labelPlacement?: "inside" | "outside" | "outside-left";
  startContent?: ReactNode;
  endContent?: ReactNode;
  fullWidth?: boolean;
  isRequired?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string;
  name?: string;
  value?: string;
}

export default function Autocomplete({
  error,
  name,
  onBlur,
  onChange,
  onInputChange,
  items,
  label,
  onSelectionChanege,
  className,
  endContent,
  fullWidth,
  inputValue,
  isRequired,
  labelPlacement,
  radius,
  value,
  placeholder,
  shouldCloseOnBlur,
  size,
  startContent,
}: IAutoconpleteProps) {
  //   const [value, setValue] = React.useState("");
  //   const [selectedKey, setSelectedKey] = React.useState<Key | null>(null);

  //   const onSelectionChange = (id:Key | null) => {
  //     setSelectedKey(id);
  //   };

  //   const onInputChange = (value: string) => {
  //     setValue(value);
  //   };

  return (
    <div className="flex w-full flex-col">
      <NextAutocomplete
        name={name}
        autoFocus={false}
        allowsCustomValue={false}
        className={className}
        defaultItems={items}
        label={label}
        labelPlacement={labelPlacement}
        radius={radius}
        size={size}
        fullWidth={fullWidth}
        placeholder={placeholder}
        shouldCloseOnBlur={shouldCloseOnBlur}
        isRequired={isRequired}
        startContent={startContent}
        endContent={endContent}
        inputValue={inputValue}
        variant="bordered"
        value={value}
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChanege}
        errorMessage={error}
        isInvalid={Boolean(error)}
        onBlur={onBlur}
        onChange={onChange}
        
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </NextAutocomplete>
      {/* <p className="mt-1 text-small text-default-500">Current selected animal: {selectedKey}</p>
      <p className="text-small text-default-500">Current input text: {value}</p> */}
    </div>
  );
}
