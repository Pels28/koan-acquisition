"use client";
import React, { ChangeEvent, ReactNode,} from "react";
import clsx from "clsx";
import { Select as NextSelect, SelectItem, SelectedItems } from "@heroui/react";
import { Key } from "@react-types/shared"; // Ensure this import matches the type used in NextSelect

export interface ISelectOption {
  id: string;
  label: string | ReactNode;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  href?: string;
  children?: Array<ISelectOption>;
  className?: string;
  value?: string;
}

interface ISelectProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  multiSelect?: boolean;
  required?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  radius?: "sm" | "md" | "lg" | "none";
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "faded" | "outlined" | "underlined";
  prepend?: ReactNode | string | number;
  className?: string;
  triggerClassName?: string;
  valueClassName?: string;
  description?: string;
  options?: Array<ISelectOption>;
  loading?: boolean;
  selectorIcon?: ReactNode;
  selectorIconRotate?: boolean;
  error?: string;
  value?: ISelectOption | Array<ISelectOption>;
  defaultSelectedKeys?: Iterable<Key> | "all" | undefined;
  onValueChange?: (val?: ISelectOption | Array<ISelectOption> | undefined) => void;
  onChange?: (e?: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<Element, Element>) => void;
  valueRender?: ((items: SelectedItems<ISelectOption>) => ReactNode) | undefined;
  autoFocus?: boolean;
    labelPlacement?: "outside" | "inside" | "outside-left"
};

export default function Select({
  label,
  id,
  name,
  className,
  triggerClassName,
  valueClassName,
  value,
  defaultSelectedKeys,
  options = [],
  placeholder,
  multiSelect,
  disabled,
  loading,
  required,
  size,
  variant = "outlined",
  rounded,
  radius,
  prepend,
  description,
  selectorIconRotate,
  selectorIcon,
  error,
  valueRender,
  onValueChange,
  onChange,
  onBlur,
  labelPlacement="outside"
}: ISelectProps) {
  const innerVariant = variant === "outlined" ? "bordered" : variant;
  const disabledKeys = options?.reduce<Array<string>>((cum, cur) => cur.disabled ? [...cum, cur.id] : cum, []);
  

  const selectedKeys = (): Set<Key> => {
    if (value) {
      if (Array.isArray(value)) {
        const selected = value.reduce<Array<Key>>((cum, curr) => [...cum, curr.value ?? curr.id], []);
        return new Set<Key>(selected);
      } else {
        return new Set<Key>([value.id]);
      }
    }
    return new Set<Key>();
  };

  const handleSelectionChange = (key: Set<Key> | Key) => {
    if (typeof key === "string" || typeof key === "number") {
      const opt = options?.find((option) => option.value === key || option.id === key);
      if (opt) {
        if (value && (Array.isArray(value) ? value.some(v => v.value === opt.value) : (value as ISelectOption).value === opt.value)) {
            if (onValueChange) {
                onValueChange(undefined)
            }
  // Unselect if selected again
        } else {
            if (onValueChange) {
                onValueChange(opt)
            }
    
        }
      }
    } else if (key instanceof Set) {
      const opts = options?.filter((option) => key.has(option.id));
      if (onValueChange) {
        onValueChange(opts.length ? opts : undefined);
      }
    
    }
  };

  

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <NextSelect
        id={id}
        name={name}
        fullWidth
        label={label}
        labelPlacement={labelPlacement}
        className={`font-montserrat ${className}`}
        defaultSelectedKeys={defaultSelectedKeys}
        showScrollIndicators
        // value={Array.from(selectedKeys()??[])}
        color={error ? "danger" : undefined}
        items={options}
        placeholder={placeholder}
        aria-label={label}
        selectionMode={multiSelect ? "multiple" : "single"}
        isDisabled={disabled}
        isRequired={required}
        isLoading={loading}
        disabledKeys={disabledKeys}
        size={size}
        variant={innerVariant}
        radius={rounded ? "full" : radius}
        startContent={prepend}
        description={description}
        selectorIcon={selectorIcon}
        disableSelectorIconRotation={!selectorIconRotate}
        errorMessage={error}
        isInvalid={Boolean(error)}
        required={required}
        selectedKeys={selectedKeys() as Iterable<Key>}
        onSelectionChange={handleSelectionChange}
        onChange={onChange}
        
        onBlur={(e) => {
          
            if (onBlur) {
                onBlur(e)
            }
        }}
        renderValue={valueRender}
        classNames={{
          innerWrapper: "border-gray-neutral",
          value: clsx(" py-2.5", valueClassName ?? ""),
          label: clsx(
          ),
          trigger: clsx("h-14 rounded-medium", { "border-red-500": error }, triggerClassName ?? ""),
          description: clsx({ "text-red-500": !!error }),
          listbox: "max-h-[200px] overflow-y-auto",
        }}

      >
        {(option) => (
      
          <SelectItem
            key={option.id}
            classNames={{base: ["font-montserrat"]}}
            startContent={option.icon}
            className={option.className}
            textValue={option.label as string}
          >
            {option.label}
          </SelectItem>
        )}
      </NextSelect>
    </div>
  );
}
