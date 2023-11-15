/* eslint-disable */
'use client';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '../ui/input';
import { useDebounce } from '@/lib/helpers/useDebounce';
import { z } from 'zod';
export const UsersSearch = () => {
  const [search, setSearch] = useState<string>('');
  const [users2, setUsers2] = useState<string[]>([]);
  console.log(`🚀 ~ UsersSearch ~ users2:`, users2);
  const result = z.string().min(1).max(50).safeParse(useDebounce(search, 500));

  const users = trpc.user.searchForUsers.useQuery(
    {
      name: result.success ? result.data : '',
    },
    { enabled: result.success }
  );

  useEffect(() => {
    console.log(`🚀 ~ useEffect ~ users.data:`, users.data);
    if (users.data) {
      setUsers2(users.data || []);
    }
    // if (search === '') {
    //   setUsers2([]);
    // }
  }, [users]);

  return (
    <div className="flex justify-center flex-col gap-2">
      <Input
        className="p-4"
        type="text"
        placeholder="Search for users "
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {users2?.map(user => (
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
