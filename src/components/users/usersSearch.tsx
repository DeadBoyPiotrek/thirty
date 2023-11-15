'use client';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '../ui/input';

export const UsersSearch = () => {
  const [search, setSearch] = useState<string>(null);
  const users = trpc.user.searchForUsers.useQuery({ name: search });

  return (
    <div className="flex justify-center flex-col gap-2">
      <Input
        className="p-4"
        type="text"
        placeholder="Search for users "
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {users.data?.map(user => (
        <Link
          key={user.id}
          className="border-b p-3 flex items-center gap-4"
          href={`/${user.id}`}
        >
          <Image
            src={`${user.imageUrl || `/images/profile-user-default.svg`}`}
            alt="avatar"
            className=" w-10 h-10 rounded-full overflow-hidden object-cover "
            width={40}
            height={40}
          />
          {user.name}
        </Link>
      ))}
    </div>
  );
};
