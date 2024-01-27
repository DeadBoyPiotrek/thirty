import { serverClient } from '@/app/_trpc/serverClient';
import { PostsList } from '@/components/quest/postsList/postsList';
import { QuestHeader } from '@/components/quest/questHeader';

const QuestPage = async ({
  params,
}: {
  params: { userId: string; questId: string };
}) => {
  const userId = parseInt(params.userId);
  const questId = parseInt(params.questId);
  const quest = await serverClient.quest.getSingleQuestWithPosts({
    userId,
    questId,
  });

  return (
    <div className="max-w-4xl flex flex-col justify-center w-full gap-3">
      <QuestHeader initialQuest={quest} userId={userId} questId={questId} />
      <PostsList initialQuest={quest} userId={userId} questId={questId} />
    </div>
  );
};

export default QuestPage;
