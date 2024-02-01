'use client';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Button } from '@ui/button';
import { Modal } from '@ui/modal';
import { useState } from 'react';
import { UserProfileForm } from '../userProfileForm/userProfileForm';
type OwnerActionsProps = {
  userData: { name: string; bio: string | null; imageName: string | null };
  session: Session;
};

export const OwnerActions = ({ session, userData }: OwnerActionsProps) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };
  if (session) {
    return (
      <div className="flex gap-2">
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Button asChild>
            <Button variant="light">Edit profile</Button>
          </Modal.Button>
          <Modal.Content>
            <UserProfileForm userData={userData} closeModal={closeModal} />
          </Modal.Content>
        </Modal>

        <Button variant="light" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }
};
