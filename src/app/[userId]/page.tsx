import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { serverClient } from '../_trpc/serverClient';
import { UserActions } from '@/components/userActions/userActions';
import { OwnerActions } from '@/components/ownerActions/ownerActions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { NotFound } from '@/components/notFound/notFound';
import { Button } from '@/components/ui/button';
const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }

  const currentUserId = session.user?.id;
  const friends = await serverClient.friends.getFriends();

  const user = await serverClient.user.getUserProfile({
    userId: params.userId,
  });

  if (user) {
    return (
      <div className="flex ">
        <div className="w-96 flex flex-col justify-center">
          <Avatar className="mt-5">
            {user.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                width={300}
                height={300}
                className="w-72 rounded-full "
              />
            ) : (
              <AvatarFallback userName={!user.name ? 'Profile' : user?.name} />
            )}
          </Avatar>
          <h2 className="font-bold text-3xl my-5 break-words">{user.name}</h2>
          {currentUserId === params.userId ? (
            <OwnerActions session={session} />
          ) : (
            <UserActions profileId={params.userId} />
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
