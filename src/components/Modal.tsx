import { CSSProperties, JSX, ReactElement, ReactNode } from "react";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextModal
} from "@heroui/react";
import clsx from "clsx";



export interface IModalProps {
  sticky?: boolean;
  show: boolean;
  showCloseButton?: boolean;
  onShow?: (isShown: boolean) => void;
  title?: string | ReactNode;
  titleClassName?: string;
  bodyContent?: string | ReactNode | ReactElement | JSX.Element | null;
  bodyClassName?: string;
  footerContent?: string | ReactNode | ReactElement | JSX.Element | null;
  footerClassName?: string;
  children?: ReactNode | ReactElement | JSX.Element;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  position?: "center" | "auto" | "top" | "top-center" | "bottom" | "bottom-center";
  radius?: "sm" | "md" | "lg" | "none" | undefined;
  scrollable?: boolean;
  backdrop?: boolean;
  backdropStyle?: "opaque" | "blur";
  backdropClassName?: string;
  baseClassName?: string;
  style?: CSSProperties | undefined;
  onClose?: () => void;
  wrapperClassName?: string;
  padded?: boolean;
  isKeyboardDismissDisabled?: boolean
  isDismissable?: boolean
}

function Modal({
  sticky,
  show,
  onShow,
  title,
  titleClassName,
  bodyContent,
  bodyClassName,
  footerContent,
  footerClassName,
  size = "md",
  children,
  position = "center",
  radius,
  scrollable,
  backdrop,
  backdropStyle = "blur",
  backdropClassName,
  showCloseButton = true,
  baseClassName,
  style,
  wrapperClassName,
  padded,
  onClose,
  isKeyboardDismissDisabled,
}: IModalProps) {


  return (
    <NextModal
      isOpen={show}
      size={size}
      isDismissable={!sticky}
      onOpenChange={onShow}
      placement={position}
      scrollBehavior={scrollable? "inside" : "normal"}
      backdrop={backdrop? backdropStyle : "transparent"}
      classNames={{
        wrapper: clsx(wrapperClassName),
        backdrop: clsx("bg-primary-blur blur-[10px]", backdropClassName),
        footer: footerClassName,
        header: clsx("text-xl sm:text-2xl font-montserrat", titleClassName),
        body: bodyClassName,
        base: clsx("py-2", baseClassName),
      }}
      radius={radius}
      hideCloseButton={!showCloseButton}
      style={style}
      onClose={onClose}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <ModalContent className={clsx(
        {"p-5": padded}
      )}>
        {() =>(
          <>
            {title && (
              <ModalHeader>{title}</ModalHeader>
            )}

            {bodyContent && (
              <ModalBody>{bodyContent}</ModalBody>
            )}

            {children}

            {footerContent && (
              <ModalFooter>{footerContent}</ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </NextModal>
  )
}

export default Modal;