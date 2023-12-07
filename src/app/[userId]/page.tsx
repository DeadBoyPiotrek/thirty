import { serverClient } from '@_trpc/serverClient';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';

import { Sidebar } from '@/components/profile/sidebar';

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const userId = parseInt(params.userId);
  const user = await serverClient.user.getUserProfile({
    userId: userId,
  });

  if (!user) {
    return notFound();
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }

  const loggedUserId = session.user?.id;

  let areFriends, isFriendRequestSent, isFriendRequestReceived;
  // TODO: I don't like this
  if (loggedUserId !== userId) {
    areFriends = await serverClient.friends.areFriends({
      profileId: userId,
    });
    isFriendRequestSent = await serverClient.friends.isFriendRequestSent({
      profileId: userId,
    });
    isFriendRequestReceived =
      await serverClient.friends.isFriendRequestReceived({
        profileId: userId,
      });
  } else {
    areFriends = false;
    isFriendRequestSent = false;
    isFriendRequestReceived = false;
  }
  // TODO: I don't like this

  return (
    <div className="flex w-full  ">
      <Sidebar
        initUser={user}
        areFriends={areFriends}
        isFriendRequestReceived={isFriendRequestReceived}
        isFriendRequestSent={isFriendRequestSent}
        userId={userId}
        session={session}
        loggedUserId={loggedUserId}
      />
      <div className="w-full">POSTS</div>
    </div>
  );
};

export default ProfilePage;
