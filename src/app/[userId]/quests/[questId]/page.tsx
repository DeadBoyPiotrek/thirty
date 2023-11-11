import { serverClient } from '@/app/_trpc/serverClient';
import { Post } from '@/components/post/post';
import Image from 'next/image';

const QuestPage = async ({
  params,
}: {
  params: { userId: string; questId: string };
}) => {
  const quest = await serverClient.quest.getSingleQuestWithPost({
    userId: parseInt(params.userId),
    questId: parseInt(params.questId),
  });

  if (!quest) {
    return <h1>Quest not found</h1>;
  }

  return (
    <>
      <h1>{quest.title}</h1>
      <p>{quest.content}</p>
      {quest.imageUrl ? (
        <Image
          src={quest.imageUrl}
          alt={quest.title}
          width={500}
          height={500}
        />
      ) : null}
      <ul>
        {quest.posts.map(post => {
          return (
            <Post
              key={post.id}
              post={{ ...post, quest: { id: quest.id, title: quest.title } }}
            />
          );
        })}
      </ul>
    </>
  );
};

export default QuestPage;
