"use client"
import { Tabs as NextTabs, Tab } from "@heroui/react";
import { ReactNode } from "react";

interface ITabsProps {
  items: { id: string; label: string | ReactNode; content: ReactNode }[];
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full" | "none";
  color?: "primary" | "secondary" | "default";
  variant?: "solid" | "underlined" | "bordered" | "light";
  fullWidth?: boolean;
  className?: string;
}

export default function Tabs({
  items,
  className,
  color,
  fullWidth,
  radius,
  size,
  variant,
}: ITabsProps) {
  return (
    <div className="flex w-full flex-col">
      <NextTabs
        className={className}
        color={color}
        fullWidth={fullWidth}
        radius={radius}
        size={size}
        variant={variant}
        aria-label="Dynamic tabs"
        items={items}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </NextTabs>
    </div>
  );
}
