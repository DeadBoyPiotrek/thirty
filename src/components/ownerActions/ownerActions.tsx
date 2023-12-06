'use client';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { useState } from 'react';
import { UserProfileForm } from '../userProfileForm/userProfileForm';
type OwnerActionsProps = {
  userData: { name: string; bio: string | null; imageName: string | null };
  session: Session;
};

export const OwnerActions = ({ session, userData }: OwnerActionsProps) => {
  const [mounted, setMounted] = useState(false);
  const closeModal = () => {
    setMounted(false);
  };
  if (session) {
    return (
      <div className="flex gap-2 my-5">
        <Modal mounted={mounted}>
          <UserProfileForm userData={userData} closeModal={closeModal} />
        </Modal>
        <Button variant={'dark'} onClick={() => setMounted(true)}>
          Edit profile
        </Button>
        <Button variant={'dark'} onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }
};
