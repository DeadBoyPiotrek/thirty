'use client';
import { trpc } from '@/app/_trpc/client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

type FriendRequestsProps = {
  initReceivedFriendRequests: {
    sender: {
      imageUrl: string | null;
      name: string;
      id: number;
    };
  }[];
  initSentFriendRequests: {
    receiver: {
      imageUrl: string | null;
      name: string;
      id: number;
    };
  }[];
};

export const FriendRequests = ({
  initReceivedFriendRequests,
  initSentFriendRequests,
}: FriendRequestsProps) => {
  const utils = trpc.useUtils();
  const receivedFriendRequests =
    trpc.friends.getReceivedFriendRequests.useQuery(undefined, {
      initialData: initReceivedFriendRequests,
      refetchOnMount: false,
    });

  const sentFriendRequests = trpc.friends.getSentFriendRequests.useQuery(
    undefined,
    {
      initialData: initSentFriendRequests,
      refetchOnMount: false,
    }
  );

  const {
    mutate: acceptFriendRequest,
    isLoading: acceptFriendRequestIsLoading,
  } = trpc.friends.acceptFriendRequest.useMutation({
    onSettled: () => {
      utils.friends.getReceivedFriendRequests.invalidate();
    },
  });
  const {
    mutate: declineFriendRequest,
    isLoading: declineFriendRequestIsLoading,
  } = trpc.friends.declineFriendRequest.useMutation({
    onSettled: () => {
      utils.friends.getSentFriendRequests.invalidate();
      utils.friends.getReceivedFriendRequests.invalidate();
    },
  });

  return (
    <div className="flex flex-col">
      <p className="text-3xl ">Friend Requests</p>
      <div className="flex gap-3 flex-wrap mt-2">
        {receivedFriendRequests.data.map(request => (
          <div
            className="flex flex-col items-center gap-2 rounded-md border border-brandBlack-light p-4 hover:bg-brandBlack-light"
            key={request.sender.id}
          >
            <Link
              className="flex flex-col items-center gap-2 rounded-md  hover:bg-brandBlack-light"
              href={`/${request.sender.id}`}
            >
              <Image
                src={`${
                  request.sender.imageUrl || `/images/profile-user-default.svg`
                }`}
                alt="avatar"
                className=" w-48 h-48 rounded-lg overflow-hidden object-cover "
                width={200}
                height={200}
              />
              <p>{request.sender.name}</p>
            </Link>
            <span className="flex gap-2">
              <Button
                variant={'brand'}
                onClick={() =>
                  acceptFriendRequest({ profileId: request.sender.id })
                }
                isLoading={acceptFriendRequestIsLoading}
              >
                Accept
              </Button>
              <Button
                variant={'dark'}
                onClick={() =>
                  declineFriendRequest({ profileId: request.sender.id })
                }
                isLoading={declineFriendRequestIsLoading}
              >
                Decline
              </Button>
            </span>
          </div>
        ))}
        {sentFriendRequests.data.map(request => (
          <div
            className="flex flex-col items-center gap-2 rounded-md border border-brandBlack-light p-4 hover:bg-brandBlack-light"
            key={request.receiver.id}
          >
            <Link
              className="flex flex-col items-center gap-2 rounded-md  hover:bg-brandBlack-light"
              href={`/${request.receiver.id}`}
            >
              <Image
                src={`${
                  request.receiver.imageUrl ||
                  `/images/profile-user-default.svg`
                }`}
                alt="avatar"
                className=" w-48 h-48 rounded-lg overflow-hidden object-cover "
                width={200}
                height={200}
              />
              <p>{request.receiver.name}</p>
            </Link>
            <span className="flex gap-2">
              <Button
                variant={'dark'}
                onClick={() =>
                  declineFriendRequest({
                    profileId: request.receiver.id,
                  })
                }
              >
                Remove
              </Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
