import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { serverClient } from '../_trpc/serverClient';
import { UserActions } from '@/components/userActions/userActions';
import { OwnerActions } from '@/components/ownerActions/ownerActions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
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
      <div>
        <Avatar>
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
        <h2 className="font-bold text-2xl">{user.name}</h2>

        {currentUserId === params.userId ? (
          <OwnerActions session={session} friends={friends} />
        ) : (
          <UserActions profileId={params.userId} />
        )}
      </div>
    );
  } else {
    return <p>user not found</p>;
  }
};

export default ProfilePage;
