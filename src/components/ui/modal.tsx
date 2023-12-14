import * as Dialog from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction } from 'react';
export const Modal = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="z-10 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
      {children}
    </Dialog.Root>
  );
};

const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog.Portal>
      <Dialog.Content className="z-20 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brandBlack-medium shadow-lg rounded-lg p-4">
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

Modal.Button = Dialog.Trigger;
Modal.Content = ModalContent;
