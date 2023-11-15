import { FriendRequests } from '@/components/friendRequests/FriendRequests';
import { serverClient } from '@/app/_trpc/serverClient';

import { UsersSearch } from '@/components/users/usersSearch';

const FriendsPage = async () => {
  const friendRequests = await serverClient.friends.getReceivedFriendRequests();

  return (
    <div>
      <UsersSearch />
      <FriendRequests friendRequests={friendRequests} />
    </div>
  );
};

export default FriendsPage;
