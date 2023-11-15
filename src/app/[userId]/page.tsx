import { serverClient } from '../_trpc/serverClient';
import { UserActions } from '@/components/userActions/userActions';
import { OwnerActions } from '@/components/ownerActions/ownerActions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { NotFound } from '@/components/notFound/notFound';
import Image from 'next/image';

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }

  const currentUserId = session.user?.id;
  const friends = await serverClient.friends.getFriends();
  const user = await serverClient.user.getUserProfile({
    userId: parseInt(params.userId),
  });

  if (user) {
    return (
      <div className="flex w-full ">
        <div className="w-96 flex flex-col justify-center">
          <Image
            src={`${user.imageUrl || `/images/profile-user-default.svg`}`}
            alt="avatar"
            className="w-72 h-72 rounded-full object-cover"
            width={300}
            height={300}
          />

          <h2 className="font-bold text-3xl mt-5 break-words">{user.name}</h2>
          {user.bio ? (
            <p className="text-xl my-5 break-words">{user.bio}</p>
          ) : null}
          {currentUserId === parseInt(params.userId) ? (
            <OwnerActions
              userData={{ name: user.name, bio: user.bio }}
              session={session}
            />
          ) : (
            <UserActions profileId={parseInt(params.userId)} />
          )}
          <div className="text-xl flex flex-col ">
            Friends
            {friends.map(friend => {
              return <p key={friend.id}>{friend.name}</p>;
            })}
          </div>
        </div>
        <div className="w-full">POSTS</div>
      </div>
    );
    //TODO is this ok to do?
  } else {
    return <NotFound />;
  }
};

export default ProfilePage;
