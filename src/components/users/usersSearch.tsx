'use client';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Image from 'next/image';
import Link from 'next/link';

export const UsersSearch = () => {
  const [search, setSearch] = useState('');
  const users = trpc.user.searchForUsers.useQuery({ name: search });

  return (
    <div className="flex justify-center flex-col gap-2">
      <input
        className="text-black p-4"
        type="text"
        placeholder="Search for users "
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {users.data?.map(user => (
        <Link
          key={user.id}
          className="border p-3 flex items-center gap-4"
          href={`/${user.id}`}
        >
          <Avatar>
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 rounded-full"
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
