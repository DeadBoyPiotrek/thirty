'use client';
import Image from 'next/image';
import Link from 'next/link';
import { OwnerActions } from '../ownerActions/ownerActions';
import { UserActions } from '../userActions/userActions';
import { serverClient } from '@/app/_trpc/serverClient';
import { Session } from 'next-auth';
import { trpc } from '@/app/_trpc/client';

interface SidebarProps {
  initUser: Awaited<
    ReturnType<(typeof serverClient)['user']['getUserProfile']>
  >;
  isFriendRequestReceived: boolean;
  isFriendRequestSent: boolean;
  areFriends: boolean;
  userId: number;
  session: Session;
  loggedUserId: number;
}

export const Sidebar = ({
  initUser,
  areFriends,
  isFriendRequestReceived,
  isFriendRequestSent,
  userId,
  session,
  loggedUserId,
}: SidebarProps) => {
  const { data: user } = trpc.user.getUserProfile.useQuery(
    { userId: userId },
    { initialData: initUser }
  );

  if (!user) {
    return <h1>User not found 💔</h1>;
  }

  return (
    <div className="w-80 flex flex-col bg-brandBlack-medium p-4 rounded-lg gap-3 h-min sticky top-0 max-h-screen overflow-y-auto">
      <Image
        src={`${user.imageUrl || `/images/profile-user-default.svg`}`}
        alt="avatar"
        className="w-72 h-72 rounded-full object-cover "
        width={288}
        height={288}
      />

      <h2 className="font-bold text-3xl break-words">{user.name}</h2>
      {user.bio ? <p className="text-xl  break-words">{user.bio}</p> : null}
      <Link
        className="text-xl font-medium  text-brandPurple-500"
        href={`/${userId}/quests`}
      >
        Quests
      </Link>
      {loggedUserId === userId ? (
        <OwnerActions
          userData={{
            name: user.name,
            bio: user.bio,
            imageName: user.imageName,
          }}
          session={session}
        />
      ) : (
        <UserActions
          profileId={userId}
          isFriendRequestReceived={isFriendRequestReceived}
          isFriendRequestSent={isFriendRequestSent}
          areFriends={areFriends}
        />
      )}
      <div className="text-xl flex flex-col gap-2 ">
        Friends
        {user.friends.map(friend => {
          return (
            <Link
              href={`/${friend.id}`}
              key={friend.id}
              className="flex items-center gap-2"
            >
              <Image
                src={`${friend.imageUrl || `/images/profile-user-default.svg`}`}
                alt={`avatar of ${friend.name}`}
                className="w-10 h-10 rounded-full overflow-hidden object-cover "
                width={40}
                height={40}
              />
              <p>{friend.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
