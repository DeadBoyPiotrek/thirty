import { serverClient } from '@_trpc/serverClient';

import { QuestList } from '@/components/quest/questsList';
const QuestsPage = async ({ params }: { params: { userId: string } }) => {
  const quests = await serverClient.quest.getQuestsWithPosts({
    userId: parseInt(params.userId),
  });
  return <QuestList quests={quests} />;
};

export default QuestsPage;
