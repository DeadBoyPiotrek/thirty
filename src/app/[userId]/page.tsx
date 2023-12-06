import { serverClient } from '@_trpc/serverClient';
import { UserActions } from '@/components/userActions/userActions';
import { OwnerActions } from '@/components/ownerActions/ownerActions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const userId = parseInt(params.userId);
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }

  const loggedUserId = session.user?.id;
  const friends = await serverClient.friends.getFriends();
  const user = await serverClient.user.getUserProfile({
    userId: userId,
  });

  if (!user) {
    return notFound();
  }

  if (loggedUserId === userId) {
    const areFriends = await serverClient.friends.areFriends({
      profileId: userId,
    });
    const isFriendRequestSent = await serverClient.friends.isFriendRequestSent({
      profileId: userId,
    });
    const isFriendRequestReceived =
      await serverClient.friends.isFriendRequestReceived({
        profileId: userId,
      });
  }

  return (
    <div className="flex w-full ">
      <div className="w-96 flex flex-col justify-center">
        <Image
          src={`${user.imageUrl || `/images/profile-user-default.svg`}`}
          alt="avatar"
          className="w-72 h-72 rounded-full object-cover "
          width={288}
          height={288}
        />

        <h2 className="font-bold text-3xl mt-5 break-words">{user.name}</h2>
        <Link
          className="text-xl font-medium my-2 text-brandPurple-500"
          href={`/${params.userId}/quests`}
        >
          Quests
        </Link>
        {user.bio ? (
          <p className="text-xl my-5 break-words">{user.bio}</p>
        ) : null}
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
          <UserActions profileId={userId} />
        )}
        <div className="text-xl flex flex-col ">
          Friends
          {friends.map(friend => {
            return (
              <Link href={`/${friend.id}`} key={friend.id}>
                <p>{friend.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="w-full">POSTS</div>
    </div>
  );
};

export default ProfilePage;
