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
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) fetchNextPage();
  }, [entry]);
  return (
    <div className="flex flex-col gap-10 w-full">
      {data?.pages.flatMap(page =>
        page.posts.map((post, i) => (
          <Post
            key={post.id}
            post={post}
            ref={i === page.posts.length - 1 ? ref : null}
          />
        ))
      )}
    </div>
  );
};
