'use client';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Image from 'next/image';
import Link from 'next/link';

export const FriendsSearch = () => {
  const [search, setSearch] = useState('');
  const users = trpc.user.searchForUsers.useQuery({ name: search });
  console.log(`🚀 ~ FriendsSearch ~ users:`, users.data);

  return (
    <div className="flex justify-center flex-col gap-2">
      <input
        className="text-black p-4"
        type="text"
        placeholder="Search for friends"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {users.data?.map(user => (
        <Link
          key={user.profileId}
          className="border p-3 flex items-center gap-4"
          href={`/${user.profileId}`}
        >
          <Avatar>
            {user.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 rounded-full hover:scale-115 transition ease-in-out duration-300"
              />
            ) : (
              <AvatarFallback userName={!user.name ? 'Profile' : user?.name} />
            )}
          </Avatar>
          {user.name}
        </Link>
      ))}
    </div>
  );
};
