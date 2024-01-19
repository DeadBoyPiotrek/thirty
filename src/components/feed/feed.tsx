'use client';
import { serverClient } from '@/app/_trpc/serverClient';
import { trpc } from '@/app/_trpc/client';
import { Post } from '../post/post';
import { useEffect, useRef } from 'react';
interface FeedProps {
  initialPosts: Awaited<
    ReturnType<(typeof serverClient)['post']['getFeedPosts']>
  >;
}
import { useIntersection } from '@mantine/hooks';

export const Feed = ({ initialPosts }: FeedProps) => {
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.5,
  });
  const { data, fetchNextPage, hasNextPage } =
    trpc.post.getFeedPosts.useInfiniteQuery(
      { limit: 3 },
      {
        getNextPageParam: lastPage => lastPage.cursor,
        initialData: {
          pageParams: [undefined],
          pages: [{ posts: initialPosts.posts, cursor: initialPosts.cursor }],
        },
        refetchOnMount: false,
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) fetchNextPage();
  }, [entry]);
  return (
    <div
      className={`flex flex-col gap-10 max-w-4xl w-full items-center pb-1${
        entry?.isIntersecting ? 'bg-red-50' : ''
      }`}
    >
      {data?.pages.flatMap(page =>
        page.posts.map((post, i) => {
          if (i === page.posts.length - 2) {
            return <Post key={post.id} post={post} ref={ref} />;
          } else {
            return <Post key={post.id} post={post} />;
          }
        })
      )}
    </div>
  );
};
