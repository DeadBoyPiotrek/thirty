'use client';
import { trpc } from '@/app/_trpc/client';

export const AddFriend = ({ profileId }: { profileId: string }) => {
  const addFriend = trpc.user.sendFriendRequest.useMutation();
  return (
    <button
      className="border p-3"
      onClick={() => addFriend.mutate({ profileId })}
    >
      {' '}
      add friend
    </button>
  );
};
