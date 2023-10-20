import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { serverClient } from '../_trpc/serverClient';
import { AddFriend } from '@/components/addFriend/addFriend';
import { OwnerActions } from '@/components/ownerActions/ownerActions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
const ProfilePage = async ({
  params,
}: {
  params: { userProfileId: string };
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }

  const currentUserProfileId = await serverClient.user.getUserProfileId();
  const friends = await serverClient.friends.getFriends();
  console.log(`🚀 ~ friends:`, friends);

  const user = await serverClient.user.getUserProfile({
    profileId: params.userProfileId,
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

        {currentUserProfileId === params.userProfileId ? (
          <OwnerActions session={session} friends={friends} />
        ) : (
          <AddFriend profileId={params.userProfileId} />
        )}
      </div>
    );
  } else {
    return <p>user not found</p>;
  }
};

export default ProfilePage;
