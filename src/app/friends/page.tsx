import { FriendRequests } from '@/components/friendRequests/FriendRequests';
import { serverClient } from '@/app/_trpc/serverClient';

import { UsersSearch } from '@/components/users/usersSearch';

const FriendsPage = async () => {
  const friendRequests = await serverClient.friends.getFriendRequests();

  return (
    <div>
      <FriendRequests friendRequests={friendRequests} />
      <UsersSearch />
    </div>
  );
};

export default FriendsPage;
