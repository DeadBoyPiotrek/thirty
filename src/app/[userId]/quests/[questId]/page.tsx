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
    <div className="max-w-4xl flex flex-col justify-center">
      <h1 className="font-bold text-brandPurple-500 text-4xl max-w-4xl break-words">
        {quest.title}
      </h1>
      <p className="max-w-4xl break-words py-2">{quest.content}</p>
      {quest.imageUrl ? (
        <Image
          src={quest.imageUrl}
          alt={quest.title}
          width={800}
          height={800}
          className="w-full h-full rounded-lg"
        />
      ) : null}
      <div className="flex flex-col gap-5 mt-4">
        {quest.posts.map(post => {
          return (
            <Post
              key={post.id}
              post={{ ...post, quest: { id: quest.id, title: quest.title } }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestPage;
