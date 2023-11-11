'use client';
import { serverClient } from '@/app/_trpc/serverClient';
import { trpc } from '@/app/_trpc/client';
import { Post } from '../post/post';
import { Button } from '../ui/button';

interface FeedProps {
  initialPosts: Awaited<
    ReturnType<(typeof serverClient)['post']['getFeedPosts']>
  >;
}

export const Feed = ({ initialPosts }: FeedProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.post.getFeedPosts.useInfiniteQuery(
      { limit: 2 },
      {
        getNextPageParam: lastPage => lastPage.cursor,
      }
    );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-5">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          Load more
        </Button>
      </div>
      {data?.pages.map(page => {
        return page.posts.map(post => {
          return <Post key={post.id} post={post} />;
        });
      })}
    </div>
  );
};
