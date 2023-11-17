'use client';
import { trpc } from '@/app/_trpc/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
  imageUrl: string | null;
};

export const UsersList = ({ inputName }: { inputName: string }) => {
  const users = trpc.user.searchForUsers.useQuery({
    name: inputName,
  });
  const [usersList, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    if (users.data) {
      setUsersList(users.data);
    }
  }, [users.data]);
  return (
    <div className="flex justify-center flex-col gap-2">
      {usersList.map(user => (
        <Link
          className="flex items-center gap-2 rounded-md p-2 hover:bg-brandBlack-light"
          key={user.id}
          href={`/${user.id}`}
        >
          <Image
            src={`${user.imageUrl || `/images/profile-user-default.svg`}`}
            alt="avatar"
            className=" w-10 h-10 rounded-full overflow-hidden object-cover "
            width={40}
            height={40}
          />
          <p>{user.name}</p>
        </Link>
      ))}
    </div>
  );
};
