"use client"

import { JSX, ReactElement, ReactNode } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Dropdown as NextDropdown
} from "@heroui/react";



export interface IDropdownOption {
  id: string;
  label: string | ReactNode;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  href?: string;
  children?: Array<IDropdownOption>;
  className?: string;
  showDivider?: boolean;
  onClick?: () => void;
}


export type Key = string | number;

interface IDropdownProps {
  label?: string;
  options?: Array<IDropdownOption>;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
  selectable?: boolean;
  multiSelect?: boolean;
  closeOnSelect?: boolean;
  selectedOption?: IDropdownOption;
  selectedOptions?: Array<IDropdownOption>;
  onChange?: (option?: IDropdownOption | Array<IDropdownOption>) => void;
  position?: "top" | "bottom" | "right" | "left" | "top-start" | "top-end" | "bottom-start" 
    | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end";
  backdrop?: "transparent" | "opaque" | "blur";
  arrowClassName?: string;
  backdropClassName?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  triggerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  blockScroll?: boolean;
  children?: ReactNode | ReactElement | JSX.Element;
};

function Dropdown({
  children,
  options = [],
  label,
  variant,
  selectable,
  multiSelect,
  closeOnSelect = true,
  selectedOption,
  selectedOptions = [],
  onChange,
  position,
  backdrop,
  arrowClassName,
  backdropClassName,
  contentClassName,
  triggerClassName,
  wrapperClassName,
  descriptionClassName,
  titleClassName,
  blockScroll,
}: IDropdownProps) {
  const selectedKeys = () =>{
    if(multiSelect && selectedOptions) {
      const selected = selectedOptions.reduce<Array<string>>((cum, curr) => [...cum, curr.id], []);
      return new Set(selected);
    } else if(selectable && selectedOption) {
      return [selectedOption.id];
    } 
  
    return undefined
  }
  const disabledKeys = options?.reduce<Array<string>>((cum, cur) => cur.disabled? [...cum, cur.id] : cum, []);


  const handleChange = (key: Set<Key> | Key ) => {
    if(typeof key == "string" || typeof key == "number") {
      const opt = options?.find((option) => option.id == key);
      if (onChange) {
        onChange(opt)
      }
    } else {
      const opts = options?.filter((option) => key.has(option.id))
      if(onChange) {
        onChange(opts)
      }
    
    }
  }


  return (
    <NextDropdown
      backdrop={backdrop} 
      placement={position}
      shouldBlockScroll={blockScroll}
      classNames={{
        arrow: arrowClassName,
        backdrop: backdropClassName,
        base: wrapperClassName,
        content: contentClassName,
        trigger: triggerClassName
      }}
      className="relative w-max"
      style={{width: "inherit"}}
      closeOnSelect={closeOnSelect}
    >
      <DropdownTrigger>
        {children}
      </DropdownTrigger>

      <DropdownMenu 
        aria-label={label??"dropdown menu"} 
        disabledKeys={disabledKeys}
        variant={variant}
        selectionMode={multiSelect? "multiple" : (selectable? "single" : "none")}
        closeOnSelect={closeOnSelect}
        selectedKeys={selectedKeys()}
        onSelectionChange={handleChange}
        itemClasses={{
          title: titleClassName,
          description: descriptionClassName,
        }}
        items={options}
      >
        {(option) => option.children? (
          <DropdownSection 
            key={option.id}
            title={typeof option.label == "string"? option.label : undefined}
            showDivider={option.showDivider}
            className={option.className}
          >
            {option.children.map((childOption) =>(
              <DropdownItem 
                key={childOption.id} 
                href={childOption.href}
                startContent={childOption.icon}
                description={childOption.description}
                className={childOption.className}
                onClick={childOption.onClick}
              >
                {childOption.label}
              </DropdownItem>
            ))}
          </DropdownSection>
        ) : (
          <DropdownItem 
            key={option.id} 
            href={option.href}
            startContent={option.icon}
            description={option.description}
            className={option.className}
            onClick={option.onClick}
            showDivider={option.showDivider}
          >
            {option.label}
          </DropdownItem>
        )}
      </DropdownMenu>
           
    </NextDropdown>
  )
}

export default Dropdown;
