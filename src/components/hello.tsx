'use client';
import { trpc } from '@/app/_trpc/client';

export const Hello = () => {
  const hello = trpc.hello.useQuery();

  if (hello.isError) {
    return <div>Error: {hello.error.message}</div>;
  }

  if (hello.isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{hello.data}</div>;
};
