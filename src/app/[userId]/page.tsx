import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { serverClient } from '../_trpc/serverClient';

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const currentUserProfileId = await serverClient.user.getUserProfileId();

  const user = await serverClient.user.getUserProfile({
    profileId: params.userId,
  });
  //! check if user is profile owner

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

        {currentUserProfileId === params.userId ? (
          <button className="border p-2">edit profile</button>
        ) : (
          <button className="border p-2">add friend</button>
        )}
      </div>
    );
  } else {
    return <p>user not found</p>;
  }
};

export default ProfilePage;
