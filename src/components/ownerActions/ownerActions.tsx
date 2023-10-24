'use client';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

type OwnerActionsProps = {
  session: Session;
  friends:
    | {
        image: string | null;
        name: string | null;
        id: string;
      }[];
};

export const OwnerActions = ({ session, friends }: OwnerActionsProps) => {
  if (session) {
    <button className="border p-2">edit profile</button>;
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <div className="border flex flex-col">
          Your friends 👯‍♂️:
          {friends.map(friend => {
            return <p key={friend.id}>{friend.name}</p>;
          })}
        </div>
      </>
    );
  }
};
