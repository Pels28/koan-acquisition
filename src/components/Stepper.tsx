"use client";
import clsx from "clsx";
import { ReactNode } from "react";
// import { useMediaQuery } from "react-responsive";

interface IStep {
  label: string;
  description?: string;
  icon?: ReactNode;
  passed?: boolean;
}

interface IStepperProps {
  steps?: Array<IStep>;
  activeStep?: number;
  setActiveStep?: (active: number) => void;
  className?: string;
  disableSwitchOnclick?: boolean;
}

export function Stepper({
  steps = [],
  activeStep = 0,
  className,
  setActiveStep,
  disableSwitchOnclick,
}: IStepperProps) {
  // const isMobile = useMediaQuery({ minWidth: 750 });

  return (
    <div className={clsx("w-full text-primary font-montserrat", className)}>
      <div className="flex w-full gap-2 my-1">
        {steps.map((step, index) => (
          <div
            key={`step-${index}`}
            onClick={() => {
              if (!disableSwitchOnclick && setActiveStep) {
                setActiveStep(index);
              }
            }}
            className={clsx("group flex-1 min-w-0", {
              "cursor-pointer": !disableSwitchOnclick,
            })}
          >
            <div
              className={clsx(
                "w-full h-1 rounded-md border-3",
                { "border-primary/25 bg-primary/25": activeStep === index },
                { "border-primary bg-primary": activeStep > index },
                { "border-gray-200 bg-gray-200": activeStep < index }
              )}
            ></div>
            <div className="pt-3 flex flex-col items-center justify-center w-full">
              {step.icon && <div>{step.icon}</div>}
              <div className="w-full text-center">
                <h3 className="font-semibold text-sm group-hover:text-primary">
                  {step.label}
                </h3>
                {step.description && (
                  <p className="opacity-50 text-xs">{step.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}