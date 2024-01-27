// TODO: can I use the same component for the user page and the feed page?
'use client';
import { serverClient } from '@/app/_trpc/serverClient';
import { Post } from '@/components/post/post';
import { trpc } from '@/app/_trpc/client';
import { useIntersection } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
interface UserPageFeedProps {
  initialPosts: Awaited<
    ReturnType<(typeof serverClient)['post']['getUserPageFeedPosts']>
  >;
  userId: number;
}

export const UserPageFeed = ({ initialPosts, userId }: UserPageFeedProps) => {
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.5,
  });

  const { data, fetchNextPage, hasNextPage } =
    trpc.post.getUserPageFeedPosts.useInfiniteQuery(
      { limit: 3, userId },
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
    <div className="flex flex-col gap-5 max-w-4xl ">
      {data?.pages.flatMap(page =>
        page.posts.map((post, i) => {
          if (i === page.posts.length - 1) {
            return <Post key={post.id} post={post} userPageFeed ref={ref} />;
          } else {
            return <Post key={post.id} userPageFeed post={post} />;
          }
        })
      )}
    </div>
  );
};
