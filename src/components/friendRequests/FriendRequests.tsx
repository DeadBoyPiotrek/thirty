'use client';
import { trpc } from '@/app/_trpc/client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

type FriendRequestsProps = {
  receivedFriendRequests: {
    sender: {
      imageUrl: string | null;
      name: string | null;
      id: number;
    };
  }[];
  sentFriendRequests: {
    receiver: {
      imageUrl: string | null;
      name: string | null;
      id: number;
    };
  }[];
};

export const FriendRequests = ({
  receivedFriendRequests,
  sentFriendRequests,
}: FriendRequestsProps) => {
  const acceptFriendRequest = trpc.friends.acceptFriendRequest.useMutation();
  return (
    <div className="flex flex-col">
      <p className="text-3xl ">Friend Requests</p>
      <div className="flex gap-3 flex-wrap mt-2">
        {receivedFriendRequests.map(request => (
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
                  acceptFriendRequest.mutate({ profileId: request.sender.id })
                }
              >
                Accept
              </Button>
              <Button
                variant={'dark'}
                onClick={() =>
                  declineFriendRequest.mutate({ profileId: request.sender.id })
                }
              >
                Decline
              </Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
