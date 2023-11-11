'use client';
import { serverClient } from '@/app/_trpc/serverClient';
import { trpc } from '@/app/_trpc/client';
import { Post } from '../post/post';

interface FeedProps {
  initialPosts: Awaited<
    ReturnType<(typeof serverClient)['post']['getFeedPosts']>
  >;
}

export const Feed = ({ initialPosts }: FeedProps) => {
  const { data, fetchNextPage, isFetchingNextPage } =
    trpc.post.getFeedPosts.useInfiniteQuery({
      undefined,
      // initialData: initialPosts,
    });
  return (
    <div className="flex flex-col gap-10">
      {/* {data.map(post => (
        <Post key={post.id} post={post} />
      ))} */}
    </div>
  );
};
