'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useDebounce } from '@/lib/helpers/useDebounce';

export const UserSearchInput = ({
  changeName,
}: {
  changeName: Dispatch<SetStateAction<string>>;
}) => {
  const [search, setSearch] = useState<string>('');
  const result = z.string().min(1).max(50).safeParse(useDebounce(search, 500));

  if (result.success) {
    changeName(result.data);
  }

  return (
    <Input
      className="p-4"
      type="text"
      placeholder="Search for users "
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  );
};
