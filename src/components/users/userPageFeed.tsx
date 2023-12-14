// TODO: can I use the same component for the user page and the feed page?
'use client';
import { serverClient } from '@/app/_trpc/serverClient';
import { Post } from '@/components/post/post';
import { trpc } from '@/app/_trpc/client';
import { useIntersection } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import { Spinner } from '@ui/spinner';
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
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetching } =
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
    <div className=" ml-5 flex flex-col gap-10 max-w-4xl w-full ">
      {isFetching && (
        <div className="flex items-center gap-4">
          <Spinner />
          Loading posts
        </div>
      )}
      {data?.pages.flatMap(page =>
        page.posts.map((post, i) => {
          if (i === page.posts.length - 1) {
            return <Post key={post.id} post={post} ref={ref} />;
          } else {
            return <Post key={post.id} post={post} />;
          }
        })
      )}
    </div>
  );
};
