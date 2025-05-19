import React,{ FormEventHandler, JSX, ReactElement, ReactNode } from "react";
import { RadioGroup, Radio, CheckboxGroup, Checkbox } from "@heroui/react";



export interface IRadioOption {
  value: string;
  title: string;
  description?: string | ReactNode | JSX.Element | ReactElement;
  isDisabled?: boolean;
}
interface IRadioGroupButtonProps {
  label?: string;
  name?: string;
  error?: string;
  defaultValue?: string | Array<string>;
  options: IRadioOption[];
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  required?: boolean;
  multiSelect?: boolean;
  value?: string | Array<string>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMultiChange?: FormEventHandler<HTMLDivElement> & ((val: Array<string>) => void);
  onBlur?: (e: React.FocusEvent) => void;
  onValueChange?: (val: string) => void;
  radioGroupStyle?: string;
  radioStyle?: string;
  size?: "sm" | "md" | "lg";
  radioGroupWrapperStyle?: string
}

function RadioButton({
  radioGroupStyle,
  radioStyle,
  label,
  name,
  error,
  defaultValue,
  options,
  orientation = "vertical",
  disabled,
  required,
  value,
  size,
  multiSelect,
  onBlur,
  onChange,
  onValueChange,
  onMultiChange,
  radioGroupWrapperStyle,
  
}: IRadioGroupButtonProps) {
  return (
    <>
      {multiSelect? (
        <CheckboxGroup
          label={label}
          defaultValue={defaultValue as Array<string>}
          isDisabled={disabled}
          isRequired={required}
          value={value as Array<string>}
          onChange={onMultiChange}
          onValueChange={onMultiChange}
          classNames={{
            base: radioGroupStyle,
            wrapper: radioGroupWrapperStyle,
          }}
          size={size}
          name={name}
          errorMessage={error}
          isInvalid={Boolean(error)}
          onBlur={onBlur}
          orientation={orientation}
        >
          {options.map((option, index) =>
            <Checkbox
            
              classNames={{
                base: radioStyle,
                wrapper: "border-[2px] border-primary"
              }}
              className="flex-grow flex-shrink basis-0 !max-w-[none]"
              key={`radio-${index}`}
              value={option.value}
              radius="full"
            >
              <div className="w-full">
                {option.title}  
                <p className="text-sm font-light text-gray-400">{option?.description}</p>        
              </div>
            </Checkbox>
          )}
        </CheckboxGroup>
      ) : (
        <RadioGroup
          label={label}
          orientation={orientation}
          defaultValue={defaultValue as string}
          isDisabled={disabled}
          isRequired={required}
          value={value as string}
          onChange={onChange}
          onValueChange={onValueChange}
          classNames={{
            base: radioGroupStyle,
            wrapper: radioGroupWrapperStyle,
            label: "text-black"
          }}
          size={size}
          name={name}
          errorMessage={error}
          isInvalid={Boolean(error)}
          onBlur={onBlur}
        >
          {options.map((option, index) =>
            <Radio
              classNames={{
                base: radioStyle,
                wrapper: "border-primary"
              }}
              className="flex-grow flex-shrink basis-0 !max-w-[none]"
              key={`radio-${index}`}
              value={option.value}
              description={option?.description}
              isDisabled={option?.isDisabled}
            >
              {option.title}          
            </Radio>
          )}
        </RadioGroup>
      )}
    </>
  )
}

export default RadioButton;