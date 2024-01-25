import { FriendRequests } from '@/components/friendRequests/FriendRequests';
import { serverClient } from '@/app/_trpc/serverClient';

import { UsersSearch } from '@/components/users/userSearch';

const FriendsPage = async () => {
  const initReceivedFriendRequests =
    await serverClient.friends.getReceivedFriendRequests();
  const initSentFriendRequests =
    await serverClient.friends.getSentFriendRequests();

  return (
    <div className="flex flex-col gap-5 mt-5 ">
      <UsersSearch />
      <FriendRequests
        initReceivedFriendRequests={initReceivedFriendRequests}
        initSentFriendRequests={initSentFriendRequests}
      />
    </div>
  );
};

export default FriendsPage;
