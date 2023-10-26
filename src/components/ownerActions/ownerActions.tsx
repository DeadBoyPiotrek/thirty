'use client';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Switch } from '@ui/switch';
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
        <button onClick={() => signOut()}>Sign out</button>
        <Switch />
        <div className="border flex flex-col ">
          Your friends
          {friends.map(friend => {
            return <p key={friend.id}>{friend.name}</p>;
          })}
        </div>
      </>
    );
  }
};
