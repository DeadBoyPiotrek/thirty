'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '../ui/button';

interface UserActionsProps {
  profileId: number;
  isFriendRequestSent: boolean;
  isFriendRequestReceived: boolean;
  areFriends: boolean;
}

export const UserActions = ({
  profileId,
  isFriendRequestReceived,
  areFriends,
  isFriendRequestSent,
}: UserActionsProps) => {
  const utils = trpc.useUtils();
  // TODO: I don't like this
  const { mutate: addFriend, isLoading: addFriendIsLoading } =
    trpc.friends.sendFriendRequest.useMutation({
      onSettled: () => {
        utils.friends.isFriendRequestSent.invalidate();
        utils.friends.isFriendRequestReceived.invalidate();
        utils.friends.areFriends.invalidate();
      },
    });
  const { mutate: removeFriend, isLoading: removeFriendIsLoading } =
    trpc.friends.removeFriend.useMutation({
      onSettled: () => {
        utils.friends.areFriends.invalidate();
        utils.user.getUserProfile.refetch();
      },
    });
  const {
    mutate: acceptFriendRequest,
    isLoading: acceptFriendRequestIsLoading,
  } = trpc.friends.acceptFriendRequest.useMutation({
    onSettled: () => {
      utils.friends.areFriends.invalidate();
      utils.user.getUserProfile.invalidate();
    },
  });
  const {
    mutate: declineFriendRequest,
    isLoading: declineFriendRequestIsLoading,
  } = trpc.friends.declineFriendRequest.useMutation({
    onSettled: () => {
      utils.friends.isFriendRequestSent.invalidate();
      utils.friends.isFriendRequestReceived.invalidate();
    },
  });
  const {
    mutate: removeSentFriendRequest,
    isLoading: removeSentFriendRequestIsLoading,
  } = trpc.friends.removeSentFriendRequest.useMutation({
    onSettled: () => {
      utils.friends.isFriendRequestSent.invalidate();
      utils.friends.isFriendRequestReceived.invalidate();
    },
  });
  const areFriends2 = trpc.friends.areFriends.useQuery(
    { profileId },
    {
      initialData: areFriends,
    }
  );
  const isFriendRequestSent2 = trpc.friends.isFriendRequestSent.useQuery(
    {
      profileId,
    },
    { initialData: isFriendRequestSent }
  );
  const isFriendRequestReceived2 =
    trpc.friends.isFriendRequestReceived.useQuery(
      { profileId },
      {
        initialData: isFriendRequestReceived,
      }
    );
  // TODO: I don't like this

  return (
    <>
      {areFriends2.data ? (
        <Button
          className="font-medium"
          variant="dark"
          onClick={() => removeFriend({ profileId })}
          isLoading={removeFriendIsLoading}
        >
          Remove Friend
        </Button>
      ) : isFriendRequestSent2.data ? (
        <Button
          className="font-medium"
          variant={'dark'}
          onClick={() => removeSentFriendRequest({ profileId })}
          isLoading={removeSentFriendRequestIsLoading}
        >
          Remove Friend Request
        </Button>
      ) : isFriendRequestReceived2.data ? (
        <>
          <Button
            className="font-medium"
            variant={'dark'}
            onClick={() => acceptFriendRequest({ profileId })}
            isLoading={acceptFriendRequestIsLoading}
          >
            Accept Friend Request
          </Button>
          <Button
            className="font-medium"
            variant={'dark'}
            onClick={() => declineFriendRequest({ profileId })}
            isLoading={declineFriendRequestIsLoading}
          >
            Decline Friend Request
          </Button>
        </>
      ) : (
        <Button
          className="border p-3"
          onClick={() => addFriend({ profileId })}
          isLoading={addFriendIsLoading}
        >
          Add Friend ❤️
        </Button>
      )}
    </>
  );
};
