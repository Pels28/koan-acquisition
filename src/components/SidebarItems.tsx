import React, { Fragment, ReactNode, useState } from "react";
import { usePathname, } from "next/navigation";
import { Chip } from "@heroui/react";
import clsx from "clsx";

import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

export type ISidebarItemProps = {
  label: string | ReactNode;
  icon?: ReactNode;
  section?: boolean;
  sideAction?: ReactNode;
  parent?: boolean;
  children?: Array<ISidebarItemProps>;
  notice?: string | number;
  href?: string;
  className?: string;
  onClose?: () => void;
  onClick?: () => void;
};

function SidebarItem({ label, icon, sideAction, children, onClose, onClick }: ISidebarItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const renderChildren = (items: ISidebarItemProps[]) =>
    items.map((child, index) => (
      <Fragment key={index}>
        {child.href ? (
          <Link
            href={child.href}
            className={clsx(
              "flex items-center pl-10 pr-2 text-base font-normal justify-between cursor-pointer",
              "rounded-xl hover:bg-primary-blur py-2 my-1",
              { "bg-primary-blur": child.href === pathname }
            )}
            onClick={() => onClose && onClose()}
          >
            <ChildContent child={child} isOpen={isOpen} handleToggleDropdown={handleToggleDropdown} />
          </Link>
        ) : (
          <div
            className={clsx(
              "flex items-center pl-10 pr-2 text-base font-normal justify-between",
              "rounded-xl hover:bg-primary-blur py-2 my-1"
            )}
            onClick={child.onClick}
          >
            <ChildContent child={child} isOpen={isOpen} handleToggleDropdown={handleToggleDropdown} />
          </div>
        )}
        
        {isOpen && child.children && (
          <div className="ml-4">{renderChildren(child.children)}</div>
        )}
      </Fragment>
    ));

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 text-primary">
        {icon}
        {label}
        <div className="flex-grow" />
        {sideAction}
      </div>

      {children && (
        <div className="mt-5 text-secondary">
          {renderChildren(children)}
        </div>
      )}
    </div>
  );
}

function ChildContent({ child, isOpen, handleToggleDropdown }: { 
  child: ISidebarItemProps; 
  isOpen: boolean; 
  handleToggleDropdown: () => void;
}) {
  return (
    <>
      {(child.children && child.children.length) ? (
        <div className="w-full flex flex-row items-center justify-between" 
          onClick={(e) => {
            e.preventDefault();
            handleToggleDropdown();
          }}
        >
          <div className="flex space-x-2">
            {child.icon}
            {child.label}
          </div>

          <FaChevronDown
            className={clsx("w-5 h-5 text-primary transition-transform duration-300", {
              "transform rotate-180": isOpen,
            })}
          />
        </div>
      ) : (
        <div className={clsx("flex gap-2 items-center", child.className)}>
          {child.icon}
          {child.label}
        </div>
      )}

      {child.notice && (
        <Chip
          size="lg"
          className="bg-misc text-white w-8 h-8 flex items-center justify-center"
        >
          {child.notice}
        </Chip>
      )}
    </>
  );
}

export default SidebarItem;
