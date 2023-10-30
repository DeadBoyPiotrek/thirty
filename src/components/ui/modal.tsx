'use client';
import { createPortal } from 'react-dom';

type ModalProps = {
  children: React.ReactNode;
  mounted: boolean;
};

export const Modal = ({ children, mounted }: ModalProps) => {
  return mounted
    ? createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
          {children}
        </div>,
        document.body
      )
    : null;
};
