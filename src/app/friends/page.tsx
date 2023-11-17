import { FriendRequests } from '@/components/friendRequests/FriendRequests';
import { serverClient } from '@/app/_trpc/serverClient';

import { UsersSearch } from '@/components/users/userSearch';

const FriendsPage = async () => {
  const friendRequests = await serverClient.friends.getReceivedFriendRequests();
  const sentFriendRequests = await serverClient.friends.getSentFriendRequests();

  return (
    <div className="flex gap-5 mt-5 ">
      <UsersSearch />
      <FriendRequests
        receivedFriendRequests={friendRequests}
        sentFriendRequests={sentFriendRequests}
      />
    </div>
  );
};

export default FriendsPage;
