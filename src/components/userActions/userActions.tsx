'use client';
import { trpc } from '@/app/_trpc/client';

export const UserActions = ({ profileId }: { profileId: string }) => {
  const addFriend = trpc.friends.sendFriendRequest.useMutation();
  const removeFriend = trpc.friends.removeFriend.useMutation();
  return (
    <>
      <button
        className="border p-3"
        onClick={() => addFriend.mutate({ profileId })}
      >
        add friend
      </button>
      <button
        className="border p-3"
        onClick={() => removeFriend.mutate({ profileId })}
      >
        remove friend
      </button>
    </>
  );
};
