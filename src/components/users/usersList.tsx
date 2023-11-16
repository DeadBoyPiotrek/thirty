'use client';
import { trpc } from '@/app/_trpc/client';
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
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
