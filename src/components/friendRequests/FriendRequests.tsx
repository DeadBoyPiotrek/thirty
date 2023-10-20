'use client';
import { trpc } from '@/app/_trpc/client';

type FriendRequestsProps = {
  friendRequests: {
    sender: {
      image: string | null;
      name: string | null;
      profileId: string;
    };
  }[];
};

export const FriendRequests = ({ friendRequests }: FriendRequestsProps) => {
  const acceptFriendRequest = trpc.friends.acceptFriendRequest.useMutation();
  return (
    <div className="border my-3 p-3">
      <h1 className="text-4xl">FriendRequests</h1>
      {friendRequests.map(request => {
        return (
          <div className="flex gap-2" key={request.sender.profileId}>
            <p>{request.sender.name}</p>
            <button
              onClick={() =>
                acceptFriendRequest.mutate({
                  profileId: request.sender.profileId,
                })
              }
            >
              Accept
            </button>
            <button>Decline</button>
          </div>
        );
      })}
    </div>
  );
};
