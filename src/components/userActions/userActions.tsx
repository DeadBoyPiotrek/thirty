'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '../ui/button';

export const UserActions = ({ profileId }: { profileId: string }) => {
  const addFriend = trpc.friends.sendFriendRequest.useMutation();
  const removeFriend = trpc.friends.removeFriend.useMutation();
  const acceptFriendRequest = trpc.friends.acceptFriendRequest.useMutation();
  const declineFriendRequest = trpc.friends.declineFriendRequest.useMutation();
  const areFriends = trpc.friends.areFriends.useQuery({ profileId });
  const removeSentFriendRequest =
    trpc.friends.removeSentFriendRequest.useMutation();
  const isFriendRequestSent = trpc.friends.isFriendRequestSent.useQuery({
    profileId,
  });
  const isFriendRequestReceived = trpc.friends.isFriendRequestReceived.useQuery(
    { profileId }
  );

  return (
    <>
      {areFriends.data ? (
        <Button
          className="border p-3"
          onClick={() => removeFriend.mutate({ profileId })}
        >
          Remove Friend 💔
        </Button>
      ) : isFriendRequestSent.data ? (
        <button
          className="border p-3"
          onClick={() => removeSentFriendRequest.mutate({ profileId })}
        >
          Remove Friend Request 🔄️
        </button>
      ) : isFriendRequestReceived.data ? (
        <>
          <button
            className="border p-3"
            onClick={() => acceptFriendRequest.mutate({ profileId })}
          >
            Accept Friend Request ✅
          </button>
          <button
            className="border p-3"
            onClick={() => declineFriendRequest.mutate({ profileId })}
          >
            Decline Friend Request ❌
          </button>
        </>
      ) : (
        <Button
          className="border p-3"
          onClick={() => addFriend.mutate({ profileId })}
        >
          Add Friend ❤️
        </Button>
      )}
    </>
  );
};
