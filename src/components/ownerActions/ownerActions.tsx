'use client';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export const OwnerActions = ({ session }: { session: Session }) => {
  if (session) {
    <button className="border p-2">edit profile</button>;
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
};
