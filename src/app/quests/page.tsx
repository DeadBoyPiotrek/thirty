import { serverClient } from '@_trpc/serverClient';

import { QuestList } from '@/components/quest/questsList';
const QuestsPage = async () => {
  const quests = await serverClient.quest.getMyQuestsWPosts();
  return <QuestList quests={quests} />;
};

export default QuestsPage;
