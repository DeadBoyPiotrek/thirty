'use client';

import { useState } from 'react';
import { UserSearchInput } from './userSearchInput';
import { UsersList } from './usersList';

export const UsersSearch = () => {
  const [inputName, setInputName] = useState<string>('');
  console.log(`🚀 ~ UsersSearch ~ inputName:`, inputName);

  return (
    <div className="flex justify-center flex-col gap-2">
      <UserSearchInput changeName={setInputName} />
      <UsersList inputName={inputName} />
    </div>
  );
};
