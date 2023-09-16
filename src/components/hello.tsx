'use client';

import { trpc } from '@/app/_trpc/client';

export const Hello = () => {
  const { data: greeting, isLoading } = trpc.hello.useQuery();

  return isLoading ? 'Loading...' : <h1>{greeting}</h1>;
};
