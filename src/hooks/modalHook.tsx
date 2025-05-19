"use client"
import React, { useCallback, useMemo, useState } from "react";

import Modal, { IModalProps } from "@/components/Modal";
import { Spinner } from "@heroui/react";

export type IModalStates = Pick<
  IModalProps,
  | "children"
  | "backdrop"
  | "scrollable"
  | "size"
  | "title"
  | "showCloseButton"
  | "backdropClassName"
  | "sticky"
  | "position"
  | "radius"
  | "titleClassName"
  | "footerContent"
  | "footerClassName"
  | "bodyContent"
  | "bodyClassName"
  | "baseClassName"
  | "backdropStyle"
  | "style"
  | "wrapperClassName"
  | "padded"
> & {
  onCloseCallback?: () => void;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
};

function useModal() {
  const [modalState, setModalState] = useState<IModalStates>({
    children: null,
    backdrop: true,
    scrollable: false,
    size: "md",
    title: "",
    showCloseButton: true,
    sticky: false,
    position: "auto",
    bodyContent: null,
    footerContent: null,
  });
  const [show, setShow] = useState(false);

  const showModal = (states: Partial<IModalStates>) => {
    setModalState({ ...modalState, ...states });
    setShow(true);
  };

  const showLoadingScreen = (sticky = true) => {
    showModal({
      sticky,
      title: "",
      backdropStyle: "opaque",
      baseClassName: "bg-[transparent] shadow-none",
      showCloseButton: false,
      children: (
        <Spinner
          color="primary"
          classNames={{
            wrapper: "w-20 h-20",
          }}
        />
      ),
    });
  };

  const closeModal = useCallback((callback?: () => void) => {
    setShow(false);
    if (callback) {
      callback();
    }
  }, []);

  const ModalComponent = () => (
    <Modal
      show={show}
      onClose={() => closeModal(modalState.onCloseCallback)}
      scrollable={modalState.scrollable}
      size={modalState.size}
      showCloseButton={modalState.showCloseButton}
      sticky={modalState.sticky}
      position={modalState.position}
      radius={modalState.radius}
      title={modalState.title}
      titleClassName={modalState.titleClassName}
      backdrop={modalState.backdrop}
      backdropClassName={modalState.backdropClassName}
      bodyContent={modalState.bodyContent}
      bodyClassName={modalState.bodyClassName}
      footerContent={modalState.footerContent}
      footerClassName={modalState.footerClassName}
      baseClassName={modalState.baseClassName}
      backdropStyle={modalState.backdropStyle}
      style={modalState.style}
      padded={modalState.padded}
      isDismissable={!modalState.sticky}
      isKeyboardDismissDisabled={modalState.isKeyboardDismissDisabled}
    >
      {modalState.children}
    </Modal>
  );

  const MemoizedModalComponent = useMemo(ModalComponent, [
    modalState,
    show,
    closeModal,
  ]);

  return {
    Modal: ModalComponent,
    MemoizedModal: MemoizedModalComponent,
    showModal,
    closeModal,
    showLoadingScreen,
    // showDeleteAlert,
  };
}

export default useModal;
