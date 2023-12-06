'use client';
import { trpc } from '@/app/_trpc/client';
import { serverClient } from '@/app/_trpc/serverClient';
import { Post } from '@/components/post/post';

interface PostsListProps {
  initialQuest: Awaited<
    ReturnType<(typeof serverClient)['quest']['getSingleQuestWithPosts']>
  >;
  userId: number;
  questId: number;
}

export const PostsList = ({
  initialQuest,
  questId,
  userId,
}: PostsListProps) => {
  const { data: quest } = trpc.quest.getSingleQuestWithPosts.useQuery(
    {
      userId,
      questId,
    },
    { initialData: initialQuest, refetchOnMount: false }
  );

  if (!quest) {
    return null;
  }

  return quest.posts.map(post => {
    return (
      <Post
        key={post.id}
        post={{ ...post, quest: { id: quest.id, title: quest.title } }}
      />
    );
  });
};
