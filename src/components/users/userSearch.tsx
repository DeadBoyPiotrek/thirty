'use client';

import { useState } from 'react';
import { UserSearchInput } from './userSearchInput';
import { UsersList } from './usersList';

export const UsersSearch = () => {
  const [inputName, setInputName] = useState<string>('');

  return (
    <div className="flex flex-col gap-2">
      <p className="text-3xl">Search for Users</p>

      <UserSearchInput changeName={setInputName} />
      <UsersList inputName={inputName} />
    </div>
  );
};
